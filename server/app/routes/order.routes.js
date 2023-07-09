const express = require("express");
const db = require("../db");
const { authJwt } = require("../middlewares");
const { status, successMessage, errorMessage } = require("../helpers/status");
const router = express.Router();

function getTotalOrderPrice(orders, totalPrice) {
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        totalPrice += parseFloat(order.test_price);
    }
    return totalPrice;
}

router.post(
    "/order/:patient_id/create-order",
    [authJwt.verifyToken],
    async (req, res) => {
        const pgClient = await db.getClient();
        await pgClient.query("BEGIN");

        const { orders } = req.body;
        const { patient_id } = req.params;
        try {
            let totalPrice = 0;
            totalPrice = getTotalOrderPrice(orders, totalPrice);
            const orderInsertQuery = `
                insert into orders (patient_id, client_id, price, status, created, created_user_id, updated, updated_user_id)
                values ($1, $2, $3, 'STP', now(), $4, now(), $4)
                returning id;
            `;
            const orderValues = [
                patient_id,
                req.client_id,
                totalPrice,
                req.user_id,
            ];

            const orderResult = await pgClient.query(
                orderInsertQuery,
                orderValues
            );

            if (!orderResult.rowCount) {
                errorMessage.message = "Orders not created";
                return res.status(status.notfound).send(errorMessage);
            }
            const orderId = orderResult.rows[0].id;

            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const orderItemInsertQuery = `
                  insert into order_item 
                  values ($1, $2, $3, $4, 'STP', null, now(), $5, now(), $5);
                `;
                const orderItemValues = [
                    orderId,
                    order.lab_company_test_id,
                    order.lab_company_id,
                    order.test_price,
                    req.user_id,
                ];

                const insertedOrderResponse = await pgClient.query(
                    orderItemInsertQuery,
                    orderItemValues
                );
                if (!insertedOrderResponse.rowCount) {
                    errorMessage.message = "Orders not created";
                    return res.status(status.notfound).send(errorMessage);
                }
            }
            await pgClient.query("COMMIT");
            successMessage.message = "Orders Created Successfully";
            successMessage.data = orderResult.rows[0];
            return res.status(status.created).send(successMessage);
        } catch (error) {
            await pgClient.query("ROLLBACK");
            errorMessage.message = "Error while creating order client patients";
            return res.status(status.error).send(errorMessage);
        } finally {
            pgClient.release();
        }
    }
);

router.put(
    "/order/:order_id/update-order",
    [authJwt.verifyToken],
    async (req, res) => {
        const pgClient = await db.getClient();
        await pgClient.query("BEGIN");

        const { orders } = req.body;
        const { order_id } = req.params;

        try {
            let totalPrice = 0;
            totalPrice = getTotalOrderPrice(orders, totalPrice);

            const orderUpdateQuery = `
                update orders
                set price = $1,
                    updated = now(),
                    updated_user_id = $2
                where id = $3
                and client_id = $4
            `;
            const orderValues = [
                totalPrice,
                req.user_id,
                order_id,
                req.client_id,
            ];
            const updatedOrderResponse = await pgClient.query(
                orderUpdateQuery,
                orderValues
            );
            if (!updatedOrderResponse.rowCount) {
                errorMessage.message = "Orders not updated";
                return res.status(status.notfound).send(errorMessage);
            }

            // Fetch existing order items associated with the order
            const existingOrderItemsQuery = `
                select lab_company_test_id
                from order_item
                where order_id = $1
            `;
            const existingOrderItemsValues = [order_id];
            const existingOrderItemsResponse = await pgClient.query(
                existingOrderItemsQuery,
                existingOrderItemsValues
            );
            const existingOrderItems = existingOrderItemsResponse.rows.map(
                (row) => row.lab_company_test_id
            );

            // Find removed order items and delete them
            const removedOrderItems = existingOrderItems.filter(
                (item) =>
                    !orders.find((order) => order.lab_company_test_id === item)
            );
            for (let i = 0; i < removedOrderItems.length; i++) {
                const lab_company_test_id = removedOrderItems[i];
                const deleteOrderItemQuery = `
                    delete from order_item
                    where order_id = $1
                      and lab_company_test_id = $2
                `;
                const deleteOrderItemValues = [order_id, lab_company_test_id];
                await pgClient.query(
                    deleteOrderItemQuery,
                    deleteOrderItemValues
                );
            }

            // Insert new order items
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const { lab_company_test_id, lab_company_id, test_price } =
                    order;

                if (!existingOrderItems.includes(lab_company_test_id)) {
                    const insertOrderItemQuery = `
                        insert into order_item (order_id, lab_company_test_id, lab_company_id, price, status, created_user_id, updated_user_id)
                        values ($1, $2, $3, $4, 'STP', $5, $5)
                    `;
                    const insertOrderItemValues = [
                        order_id,
                        lab_company_test_id,
                        lab_company_id,
                        test_price,
                        req.user_id,
                    ];
                    await pgClient.query(
                        insertOrderItemQuery,
                        insertOrderItemValues
                    );
                }
            }

            await pgClient.query("COMMIT");
            successMessage.data = updatedOrderResponse.rows;
            successMessage.message = "Orders updated successfully";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            await pgClient.query("ROLLBACK");
            errorMessage.message = "Error while updating order";
            return res.status(status.error).send(errorMessage);
        } finally {
            pgClient.release();
        }
    }
);

router.get(
    "/order/:orderId/order-items",
    [authJwt.verifyToken],
    async (req, res) => {
        const { orderId } = req.params;
        try {
            const orderItemsQuery = `
            select oi.lab_company_test_id
            , oi.price test_price
            , lct.name lab_company_test_name
            , lc.name lab_company_name
            from order_item oi
            left join lab_company_test lct on oi.lab_company_test_id = lct.id
            left join lab_company lc on lc.id = lct.lab_company_id
            where oi.order_id = $1
            `;

            const orderItemsValues = [orderId];
            const orderItemsResponse = await db.query(
                orderItemsQuery,
                orderItemsValues
            );
            successMessage.data = orderItemsResponse.rows;
            successMessage.message = "Orders updated successfully";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = "Error while getting order items";
            return res.status(status.error).send(errorMessage);
        }
    }
);

router.put(
    "/order/update-order/status",
    [authJwt.verifyToken],
    async (req, res) => {
        const pgClient = await db.getClient();
        await pgClient.query("BEGIN");
        const { order_id } = req.body;
        try {
            pgClient.query(
                `update orders
                set status='C'
                where id = $1
                and client_id = $2
                `,
                [order_id, req.client_id]
            );

            pgClient.query(
                `update order_item
                set status='C'
                where order_id = $1
                `,
                [order_id]
            );
            await pgClient.query("COMMIT");
            successMessage.message = "Orders updated successfully";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            await pgClient.query("ROLLBACK");

            errorMessage.message = "Error while updating order status";
            return res.status(status.error).send(errorMessage);
        } finally {
            pgClient.release();
        }
    }
);
module.exports = router;

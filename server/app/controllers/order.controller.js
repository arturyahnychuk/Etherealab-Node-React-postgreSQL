const db = require("../db");
const { status, successMessage, errorMessage } = require("../helpers/status");

const createOrder = async (req, res) => {
    const pgClient = await db.getClient();
    await pgClient.query("BEGIN");

    const { orders } = req.body;
    const { patient_id } = req.params;
    try {
        let totalPrice = 0;
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            totalPrice += order.test_price;
        }
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

        const orderResult = await pgClient.query(orderInsertQuery, orderValues);

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
            console.log(insertedOrderResponse.rowCount);
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
};
const Order = {
    createOrder,
};
module.exports = Order;

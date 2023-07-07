import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import OrderItem from "./OrderItem";

const useStyles = makeStyles((theme) => ({
    ordersContainer: {
        position: "relative",
        minHeight: "400px !important",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        paddingBottom: theme.spacing(17) + " !important",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: theme.spacing(2),
        "& p": {
            fontWeight: 500,
        },
    },
    orderButtons: {
        position: "absolute ",
        bottom: "10px",
        left: "50%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        transform: "translateX(-50%)",
        "& button": {
            textTransform: "none !important",
            whiteSpace: "nowrap",
            textAlign: "center",
        },
    },
    btnOrder: {
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
        fontWeight: 700,
        fontSize: "15px",
    },
    btnCancel: {
        color: theme.palette.black + " !important",
        marginTop: theme.spacing(2) + " !important",
    },
    orderPlaceholder: {
        fontSize: "14px",
        color: theme.palette.text.secondary,
        textAlign: "center",
        marginTop: theme.spacing(4),
    },
}));

function Orders(props) {
    const classes = useStyles();
    const {
        orders,
        totalPrice,
        setCancelOrder,
        handleAddOrder,
        handleSubmitOrder,
        editMode,
    } = props;
    return (
        <Box className={classes.ordersContainer} p={2} ml={2}>
            <Typography> {editMode ? "Edit Order" : "New Order"}</Typography>
            {orders.length > 0 ? (
                <>
                    {orders.map((order) => (
                        <OrderItem
                            key={order.lab_company_test_id}
                            order={order}
                            removeOrder={(item) => handleAddOrder(item)}
                        />
                    ))}
                    <Box className={classes.totalRow}>
                        <Typography>Total</Typography>
                        <Typography>&#36; {totalPrice}</Typography>
                    </Box>
                    <Box className={classes.orderButtons}>
                        <Button
                            variant="contained"
                            className={classes.btnOrder}
                            onClick={handleSubmitOrder}
                        >
                            {editMode
                                ? "Send Updated Order to Patient"
                                : "Send  Order To Patient"}
                        </Button>
                        <Button
                            variant="text"
                            className={classes.btnCancel}
                            onClick={() => setCancelOrder(true)}
                        >
                            Cancel Order
                        </Button>
                    </Box>
                </>
            ) : (
                <p className={classes.orderPlaceholder}>
                    Click a test to add it to this order
                </p>
            )}
        </Box>
    );
}

export default Orders;

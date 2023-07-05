import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    orderItem: {
        display: "flex",
        justifyContent: "space-between",
        "& p": {
            fontSize: "13px",
        },
        marginTop: theme.spacing(1),
        padding: theme.spacing(1, 0),
    },
    button: {
        color: theme.palette.text.secondary + "! important",
        fontSize: "14px ! important",
        textTransform: "none ! important",
        padding: theme.spacing(0, 0.5) + "! important",
    },
}));
function OrderItem(props) {
    const { order, removeOrder } = props;
    const classes = useStyles();
    return (
        <Box className={classes.orderItem}>
            <Box>
                <Typography>{order.lab_company_name}</Typography>
                <Typography>{order.lab_company_test_name}</Typography>
                <Typography>{order.sample_type_name}</Typography>
            </Box>
            <Box>
                <Typography>&#36; {order.test_price}</Typography>
                <Button
                    className={classes.button}
                    onClick={() => removeOrder(order)}
                >
                    Remove
                </Button>
            </Box>
        </Box>
    );
}

export default OrderItem;

import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
    Box,
    Grid,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
} from "@mui/material";
import {
    StyledTableCellSm,
    StyledTableRowSm,
} from "../../../components/common/StyledTable";
import clsx from "clsx";
import CancelOrderModal from "./CancelOrderModal";
import orderService from "../../../services/order.service";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
    },
    pageTitle: {
        marginBottom: theme.spacing(3) + "!important",
    },
    orderDetails: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        padding: theme.spacing(2, 1.5),
        marginBottom: theme.spacing(2),
    },
    flex: {
        display: "flex",
        alignItems: "center",
    },
    button: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        color: theme.palette.black,
        backgroundColor: theme.palette.white,
        textDecoration: "none",
        padding: theme.spacing(1, 2),
        whiteSpace: "nowrap",
        fontSize: "12px",
        cursor: "pointer",
    },
    orderSummary: {
        "& p": {
            fontSize: "14.5px",
            fontWeight: 500,
            whiteSpace: "nowrap",
        },
        "& span": {
            fontWeight: 300,
            marginRight: theme.spacing(1.5),
            color: theme.palette.text.secondary,
        },
    },
    tableContainer: {
        maxWidth: "70%",
    },
}));
function OrderDetails(props) {
    const classes = useStyles();
    const { orderItems, cancelOrder: updateOrderState, patientId } = props;
    const [cancelOrder, setCancelOrder] = useState(false);

    const handleCancelOrder = async () => {
        try {
            await orderService.updateOrderStatus({
                order_id: orderItems[0].order_id,
            });
            updateOrderState(orderItems[0].order_id);
            setCancelOrder(false);
        } catch (error) {
            setCancelOrder(true);
        }
    };
    return (
        <Box className={classes.orderDetails}>
            <Grid container mb={0.5}>
                <Grid
                    item
                    xs={8.5}
                    className={clsx(classes.flex, classes.orderSummary)}
                >
                    <Typography>
                        Order ID: <span>{orderItems[0].order_id}</span>
                    </Typography>
                    <Typography>
                        Created: <span>{orderItems[0].order_created}</span>
                    </Typography>
                    <Typography>
                        Updated: <span>{orderItems[0].order_updated}</span>
                    </Typography>
                    <Typography>
                        Order Status: <span>{orderItems[0].order_status}</span>
                    </Typography>
                    <Typography>
                        Created By:
                        <span>{orderItems[0].order_created_user}</span>
                    </Typography>
                </Grid>
                <Grid item xs={3.5} className={classes.flex} columnGap={2}>
                    <RouterLink
                        to={`/patient/${patientId}/edit-order/${orderItems[0].order_id}`}
                        className={clsx(
                            classes.button,
                            orderItems[0].order_status !== "Sent To Patient" &&
                                classes.disabled
                        )}
                    >
                        Edit Order
                    </RouterLink>
                    <button
                        className={clsx(
                            classes.button,
                            orderItems[0].order_status !== "Sent To Patient" &&
                                classes.disabled
                        )}
                        onClick={() => setCancelOrder(true)}
                    >
                        Cancel Order
                    </button>
                    <RouterLink
                        to={`/patient/${patientId}/new-order`}
                        className={classes.button}
                    >
                        New Order
                    </RouterLink>
                </Grid>
            </Grid>
            <TableContainer className={classes.tableContainer}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <StyledTableRowSm>
                            <StyledTableCellSm>Lab Company</StyledTableCellSm>
                            <StyledTableCellSm>Test Name</StyledTableCellSm>
                            <StyledTableCellSm>Sample</StyledTableCellSm>
                            <StyledTableCellSm>Updated</StyledTableCellSm>
                            <StyledTableCellSm>Status</StyledTableCellSm>
                        </StyledTableRowSm>
                    </TableHead>
                    <TableBody>
                        {orderItems &&
                            orderItems.length > 0 &&
                            orderItems.map((item, idx) => (
                                <StyledTableRowSm key={idx}>
                                    <StyledTableCellSm>
                                        {item.lab_company_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.lab_company_test_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.sample_type_name}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.order_item_updated}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.order_item_status}
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CancelOrderModal
                cancelOrder={cancelOrder}
                setCancelOrder={setCancelOrder}
                handleCancelOrder={handleCancelOrder}
            />
        </Box>
    );
}

export default OrderDetails;

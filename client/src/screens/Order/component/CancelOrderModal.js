import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import React from "react";

function CancelOrderModal(props) {
    const { cancelOrder, setCancelOrder, handleCancelOrder } = props;
    return (
        <Dialog open={cancelOrder} onClose={() => setCancelOrder(false)}>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to cancel this order?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelOrder} color="primary">
                    Yes
                </Button>
                <Button onClick={() => setCancelOrder(false)} color="primary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CancelOrderModal;

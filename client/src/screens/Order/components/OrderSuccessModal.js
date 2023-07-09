import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    orderSuccessContainer: {
        height: "200px",
        width: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        "& p": {
            fontSize: "13px",
        },
        padding: theme.spacing(1, 0),
    },
    button: {
        fontSize: "14px ! important",
        textTransform: "none ! important",
        padding: theme.spacing(1, 2.5) + "! important",
        fontWeight: 600,
        marginTop: theme.spacing(2) + "! important",
    },
}));
function OrderSuccessModal(props) {
    const { handleGoToDashboard } = props;
    const classes = useStyles();
    return (
        <Box className={classes.orderSuccessContainer}>
            <Typography>Order submitted successfully!</Typography>
            <Typography>
                An email will be sent to the patient explaining the next steps
            </Typography>

            <Button
                variant="contained"
                onClick={handleGoToDashboard}
                className={classes.button}
            >
                Go to Dashboard
            </Button>
        </Box>
    );
}

export default OrderSuccessModal;

import React, { useState } from "react";

import { useSnackbar } from "notistack";
import Dimmer from "../../../components/common/Dimmer";
import EmailService from "../../../services/email.service";
import { Alert, Button, Card, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
        textAlign: "center",
        "& p": {
            fontSize: "16px",
            lineHeight: "24px",
        },
    },
}));

const Success = ({ user }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendResendEmailRequest = () => {
        setIsLoading(true);
        EmailService.resendEmailVerification(user).then(
            (response) => {
                setErrors(response.data);
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                });
                setIsLoading(false);
            },
            (error) => {
                setErrors(error.response);
            }
        );
    };

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                {errors && (
                    <Alert severity={errors.status || "error"}>
                        {errors.message}
                    </Alert>
                )}
                <p>Thank you for signing up. </p>
                <p>
                    Please confirm your email address by clicking the link in
                    the email just sent to you.
                </p>
                <p>
                    <Button
                        onClick={() => sendResendEmailRequest()}
                        color="primary"
                    >
                        Resend confirmation email
                    </Button>
                </p>
            </CardContent>
            <Dimmer isOpen={isLoading} />
        </Card>
    );
};

export default Success;

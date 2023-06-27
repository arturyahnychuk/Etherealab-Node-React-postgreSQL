import React, { useState } from "react";

import { useSnackbar } from "notistack";
import { useSelector, shallowEqual } from "react-redux";

import Logo from "../../assets/img/logo.svg";
import Dimmer from "../../components/common/Dimmer";
import Error from "../../components/common/Error";
import AuthService from "../../services/auth.service";
import EmailService from "../../services/email.service";
import Success from "./Success";
import { makeStyles } from "@mui/styles";
import {
    Button,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex !important",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        padding: theme.spacing(2),
    },
    pageTitle: {
        marginBottom: theme.spacing(3),
        color: theme.palette.text.secondary,
    },
    Error: {
        marginTop: theme.spacing(2),
    },

    form: {
        width: "100%", // Fix IE 11 issue.
        textAlign: "center",
        marginTop: theme.spacing(3),
        border: "1px solid",
        borderColor: theme.borderColor,
        borderRadius: "2px",
        padding: theme.spacing(4),
    },
    submit: {
        margin: `${theme.spacing(3, 0, 2)} !important`,
    },
    customLink: {
        textDecoration: "none",
        color: theme.palette.text.secondary,
        paddingTop: theme.spacing(1),
    },
    Logo: {
        maxWidth: "180px",
        width: 170,
        height: 65,
        objectFit: "contain",
    },
}));

const ForgetPassword = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState([]);
    const [registrationLink, setRegistrationLink] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const success = useSelector((state) => state.common.success, shallowEqual);

    const sendPasswordResetEmail = (e) => {
        e.preventDefault();
        setIsLoading(true);
        AuthService.passwordChangeRequest(email).then(
            (response) => {
                setIsLoading(false);
                enqueueSnackbar(`${response.data.message}`, {
                    variant: "success",
                });
                setErrors([]);
            },
            (error) => {
                setIsLoading(false);
                if (error.response) {
                    const { data, status } = error.response;
                    if (status === 400) {
                        setErrors(data.message);
                    } else {
                        setErrors([]);
                    }
                    if (data && data.user && data.user.sign_dt === null) {
                        setRegistrationLink(true);
                    }

                    if (
                        data &&
                        data.user &&
                        data.user.email_confirm_dt === null
                    ) {
                        setRegistrationLink(false);
                        // Send email verification link
                        EmailService.resendEmailVerification(
                            error.response.data.user
                        ).then(
                            (response) => {
                                console.info(
                                    "resendEmailVerification response",
                                    response.response
                                );
                            },
                            (err) => {
                                console.error(
                                    "resendEmailVerification error.response",
                                    err.response
                                );
                            }
                        );
                    }
                }
            }
        );
        setEmail("");
    };

    return (
        <Container component="main" maxWidth="sm" className={classes.container}>
            <CssBaseline />
            <div className={classes.paper}>
                <img src={Logo} alt="Logo" className={classes.Logo} />
                <Typography
                    component="h1"
                    variant="h5"
                    className={classes.pageTitle}
                >
                    Forgot Password
                </Typography>
                <Error errors={errors}>
                    {registrationLink && (
                        <Link href="/signup_client">
                            Go to user registration
                        </Link>
                    )}
                </Error>
                {success && (
                    <Success
                        header="If that account is in our system then we have sent an email with instructions
                to reset your password"
                        loginText="Sign back in"
                    />
                )}
                {!success && (
                    <>
                        <Link href="/login_client" underline="none">
                            <Typography
                                variant="body1"
                                className={classes.customLink}
                            >
                                Login to account
                            </Typography>
                        </Link>
                        <form
                            className={classes.form}
                            noValidate
                            onSubmit={sendPasswordResetEmail}
                        >
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                inputProps={{ maxLength: 255 }}
                                helperText={`${
                                    email.length >= 255
                                        ? "Enter an email between 255 character"
                                        : ""
                                }`}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={!email}
                            >
                                Send Password
                            </Button>
                        </form>
                    </>
                )}
            </div>
            <Dimmer isOpen={isLoading} />
        </Container>
    );
};

export default ForgetPassword;

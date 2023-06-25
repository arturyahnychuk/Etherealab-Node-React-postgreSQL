import React, { useState } from "react";

import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

import Logo from "../assets/img/logo.svg";
import Error from "../components/common/Error";
import AuthService from "../services/auth.service";
import Success from "./ForgetPassword/Success";
import { makeStyles } from "@mui/styles";
import {
    Button,
    Container,
    CssBaseline,
    Grid,
    TextField,
    Typography,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        padding: theme.spacing(2),
    },
    marginTop: {
        marginTop: theme.spacing(16),
    },
    pageTitle: {
        marginBottom: theme.spacing(3),
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
    resetPasswordFormSentWrapper: {},
    resetPasswordFormWrapper: {},
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    Logo: {
        maxWidth: "180px",
        width: 170,
        height: 65,
        objectFit: "contain",
    },
}));

const ResetPassword = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { userId, token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    const handlePasswordReset = (e) => {
        e.preventDefault();
        AuthService.resetPassword(userId, token, password).then(
            (response) => {
                enqueueSnackbar(`${response.data.message}`, {
                    variant: "success",
                });
                setSuccess(true);
            },
            (error) => {
                if (!error.response) {
                    return;
                }
                const { data, status } = error.response;

                if (status === 400) {
                    setFieldErrors(data.message);
                } else {
                    setFieldErrors([]);
                }
            }
        );
        setPassword("");
        setConfirmPassword("");
    };

    const validatePassword = (event) => {
        if (event.target.value.length < 8) {
            setFieldErrors([
                {
                    value: event.target.value,
                    msg: "Too Weak. Must be atleast 8 Characters",
                    param: "user.password",
                },
            ]);
        } else {
            setFieldErrors([]);
        }
    };

    const validatePasswordConfirm = () => {
        if (confirmPassword !== password) {
            setFieldErrors([
                {
                    value: `password: ${password} confirmPassword ${confirmPassword}`,
                    msg: "Password and ConfirmPassword must be same!",
                },
            ]);
        }
        if (confirmPassword === password) {
            setFieldErrors([]);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className={classes.root}>
            <Grid className={classes.marginTop}>
                <CssBaseline />
                <div className={classes.paper}>
                    <img src={Logo} alt="Logo" className={classes.Logo} />
                    <Typography
                        component="h1"
                        variant="h5"
                        className={classes.pageTitle}
                    >
                        Reset Password
                    </Typography>
                    {success && (
                        <Success
                            header="Your password has been saved."
                            loginText="Sign back in"
                        />
                    )}
                    {!success && (
                        <div className={classes.resetPasswordFormWrapper}>
                            <Error errors={fieldErrors} />
                            <form className={classes.form} noValidate>
                                <TextField
                                    value={password}
                                    variant="outlined"
                                    margin="dense"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    onBlur={(event) => validatePassword(event)}
                                />
                                <TextField
                                    value={confirmPassword}
                                    variant="outlined"
                                    margin="dense"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="confirm-password"
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    onBlur={(event) =>
                                        validatePasswordConfirm(event)
                                    }
                                />
                                <Button
                                    fullWidth
                                    disabled={
                                        !password ||
                                        !confirmPassword ||
                                        password !== confirmPassword
                                    }
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={(event) =>
                                        handlePasswordReset(event)
                                    }
                                >
                                    Reset
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </Grid>
        </Container>
    );
};

export default ResetPassword;

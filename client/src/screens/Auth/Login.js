import React, { useState } from "react";

import Container from "@mui/material/Container";
import { ReactComponent as LogoSvg } from "../../assets/img/logo.svg";
import {
    Button,
    CssBaseline,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import useAuth from "../../hooks/useAuth";
import { makeStyles } from "@mui/styles";
import Error from "../../components/common/Error";
import { Redirect } from "react-router-dom";

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
        padding: theme.spacing(2),
    },
    pageTitle: {
        marginBottom: theme.spacing(3),
        color: theme.palette.text.secondary,
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

function Login() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [apiErrors, setApiErrors] = useState([]);

    const onFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(email.trim(), password.trim()); // Call AuthProvider login
            <Redirect to="/" />;
        } catch (error) {
            enqueueSnackbar("Unable to login", {
                variant: "error",
            });
            setApiErrors([
                {
                    msg: error.message || "Something went wrong",
                },
            ]);
        }
    };
    return (
        <Container component="main" maxWidth="sm" className={classes.container}>
            <CssBaseline />
            <div className={classes.paper}>
                <LogoSvg width={170} height={65} />
                <Typography
                    component="h5"
                    variant="h5"
                    className={classes.pageTitle}
                >
                    Login to your account
                </Typography>

                <Link href="/signup" underline="none">
                    <Typography variant="body1" className={classes.customLink}>
                        Don't have an account? Sign up here
                    </Typography>
                </Link>
                <div>
                    <Error errors={apiErrors} />
                    <form
                        className={classes.form}
                        noValidate
                        onSubmit={(event) => onFormSubmit(event)}
                    >
                        <TextField
                            value={email}
                            variant="outlined"
                            margin="dense"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(event) => setEmail(event.target.value)}
                            inputProps={{ maxLength: 255 }}
                            helperText={`${
                                email.length >= 255
                                    ? "Enter an email between 255 character"
                                    : ""
                            }`}
                        />
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
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            inputProps={{ maxLength: 128 }}
                            helperText={`${
                                password.length >= 128
                                    ? "Enter a password between 128 character"
                                    : ""
                            }`}
                        />
                        <Button
                            type="submit"
                            disabled={!email || !password}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>

                        <Link href="/forgot-password" underline="none">
                            <Typography
                                variant="body1"
                                className={classes.customLink}
                            >
                                Forgot password?
                            </Typography>
                        </Link>
                    </form>
                </div>
            </div>
        </Container>
    );
}

export default Login;

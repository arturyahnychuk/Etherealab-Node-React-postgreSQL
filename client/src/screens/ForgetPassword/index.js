import React, { useState } from "react";

import {
    Button,
    Container,
    CssBaseline,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";

import Logo from "../../assets/img/logo.svg";
import Dimmer from "../../components/common/Dimmer";
import Error from "../../components/common/Error";
import AuthService from "../../services/auth.service";

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
                }
            }
        );
        setEmail("");
    };

    return (
        <Container component="main" maxWidth="sm" className={classes.container}>
            <CssBaseline />
            <div className={classes.paper}>
                <RouterLink to="/">
                    <img src={Logo} alt="Logo" className={classes.Logo} />
                </RouterLink>
                <Typography
                    component="h1"
                    variant="h5"
                    className={classes.pageTitle}
                >
                    Forgot Password
                </Typography>
                <Error errors={errors}>
                    {registrationLink && (
                        <Link href="/signup">Go to user registration</Link>
                    )}
                </Error>

                <Link href="/login" underline="none">
                    <Typography variant="body1" className={classes.customLink}>
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
                        onChange={(event) => setEmail(event.target.value)}
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
            </div>
            <Dimmer isOpen={isLoading} />
        </Container>
    );
};

export default ForgetPassword;

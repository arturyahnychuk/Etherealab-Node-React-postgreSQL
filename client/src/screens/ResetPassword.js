import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useParams, useHistory } from "react-router-dom";

import Logo from "../assets/img/logo.svg";
import Error from "../components/common/Error";
import AuthService from "../services/auth.service";
import { makeStyles } from "@mui/styles";
import {
    Button,
    Container,
    CssBaseline,
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
    const [fieldErrors, setFieldErrors] = useState([]);
    const history = useHistory();

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        try {
            const response = await AuthService.resetPassword(
                userId,
                token,
                password
            );
            enqueueSnackbar(`${response.data.message}`, {
                variant: "success",
            });
            history.push("/login_client");
        } catch (error) {
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

        setPassword("");
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
                    Reset Password
                </Typography>

                <Error errors={fieldErrors} />
                <form className={classes.form} noValidate>
                    <TextField
                        value={password}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        onChange={(event) => setPassword(event.target.value)}
                        onBlur={(event) => validatePassword(event)}
                    />

                    <Button
                        fullWidth
                        disabled={!password}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={(event) => handlePasswordReset(event)}
                    >
                        Reset
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default ResetPassword;

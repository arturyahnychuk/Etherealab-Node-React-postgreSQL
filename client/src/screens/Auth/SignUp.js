import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useSnackbar } from "notistack";

import Logo from "../../assets/img/logo.svg";
import AuthService from "../../services/auth.service";
import PracticeForm from "./components/PracticeForm";
import { makeStyles } from "@mui/styles";
import { Container, CssBaseline, Link, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
    pageTitle: {
        marginBottom: theme.spacing(3),
        color: theme.palette.text.secondary,
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    Logo: {
        maxWidth: "180px",
        width: 170,
        height: 65,
        objectFit: "contain",
    },
    customLink: {
        textDecoration: "none",
        color: theme.palette.text.secondary,
        paddingTop: theme.spacing(1),
    },
    container: {
        display: "flex !important",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
    },
}));

const SignUp = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();

    const handleFormSubmit = (data) => {
        AuthService.register(data).then(
            (response) => {
                enqueueSnackbar(`${response.data.message}`, {
                    variant: "success",
                });
                // Dispatch the Redux action after successful registration

                console.log({ user: response.data.user });
                dispatch({
                    type: "LOGIN",
                    payload: {
                        user: response.data.user,
                    },
                });

                return <Redirect to="/" />;
            },
            (error) => {
                if (error.response) {
                    setErrors(error.response.message);
                }
            }
        );
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
                    Sign Up for a new account
                </Typography>
                <Link href="/login_client" underline="none">
                    <Typography variant="body1" className={classes.customLink}>
                        Already a member? Login here
                    </Typography>
                </Link>
                <div>
                    <PracticeForm
                        onFormSubmit={handleFormSubmit}
                        errors={errors}
                    />
                </div>
            </div>
        </Container>
    );
};

export default SignUp;

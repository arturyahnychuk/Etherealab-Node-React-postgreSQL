import React, { useState } from "react";

import { useSnackbar } from "notistack";

import Logo from "../../assets/img/logo.svg";
import AuthService from "../../services/auth.service";
import PracticeForm from "./components/PracticeForm";
import { makeStyles } from "@mui/styles";
import { Container, CssBaseline, Link, Typography } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    pageTitle: {
        marginBottom: theme.spacing(3),
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(2),
    },
    Logo: {
        maxWidth: "180px",
        width: 170,
        height: 65,
        objectFit: "contain",
    },
    link: {
        "& a": {
            textDecoration: "none",
            color: "theme.palette.text.secondary",
        },
    },
}));

const SignUp = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState([]);

    const handleFormSubmit = (data) => {
        AuthService.register(data).then(
            (response) => {
                enqueueSnackbar(`${response.data.message}`, {
                    variant: "success",
                });
            },
            (error) => {
                if (error.response) {
                    setErrors(error.response.data.message);
                }
            }
        );
    };

    return (
        <Container component="main" maxWidth="xs">
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
                <Link href="/login_client" className={classes.link}>
                    Already a member? Login here
                </Link>

                <PracticeForm onFormSubmit={handleFormSubmit} errors={errors} />
            </div>
        </Container>
    );
};

export default SignUp;

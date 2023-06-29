import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

import Logo from "../../assets/img/logo.svg";
import AuthService from "../../services/auth.service";
import PracticeForm from "./components/PracticeForm";
import { makeStyles } from "@mui/styles";
import { Container, CssBaseline, Link, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";

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
    const { setUser } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const handleFormSubmit = async (data) => {
        try {
            const response = await AuthService.register(data);
            enqueueSnackbar(`${response.data.message}`, {
                variant: "success",
            });
            const { accessToken, user } = response.data.data;
            setUser(user, accessToken);

            history.push("/dashboard");
        } catch (error) {
            if (error.response) {
                setErrors(error.response.message);
            }
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
                    Sign Up for a new account
                </Typography>
                <Link href="/login" underline="none">
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

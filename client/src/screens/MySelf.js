import {
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
} from "@mui/material";
import Error from "../components/common/Error";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import SaveIcon from "@mui/icons-material/Save";
import { useSnackbar } from "notistack";

import useAuth from "../hooks/useAuth";
import authService from "../services/auth.service";
import TextFieldWithError from "./Auth/components/TextFieldWithError";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow:
            "0 15px 35px 0 rgb(60 66 87 / 8%), 0 5px 15px 0 rgb(0 0 0 / 12%)",
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
        marginTop: theme.spacing(1),
    },
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

function MySelf() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { login } = useAuth();

    const [apiErrors, setApiErrors] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState([]);

    const handleFormSubmission = (e) => {
        e.preventDefault();

        const formData = {
            firstname: firstName.trim(),
            lastname: lastName.trim(),
            email: email.trim(),
            password: password.trim(),
        };

        // onFormSubmit(formData);
    };

    const validatePassword = (event) => {
        if (event.target.value.length < 8) {
            setFieldErrors([
                ...fieldErrors,
                {
                    value: event.target.value,
                    msg: "Too Weak. Must be atleast 8 Characters",
                    param: "users.password",
                },
            ]);
        } else {
            const updatedErrors = fieldErrors.filter(
                (error) => error.param !== "users.password"
            );
            setFieldErrors(updatedErrors);
        }
    };

    const getFieldError = (target, fieldName) => {
        let value = `client.${fieldName}`;
        if (target) {
            value = `${target}.${fieldName}`;
        }
        return fieldErrors && fieldErrors.filter((err) => err?.param === value);
    };

    const handleAjaxValidation = (event, target) => {
        if (!event.target) {
            return;
        }

        authService
            .validate({
                fieldName: event.target.name,
                value: event.target.value,
                target: target || "client",
            })
            .then(
                (response) => {
                    // Remove errors record with param
                    const updatedErrors = fieldErrors.filter(
                        (error) => error.param !== response.data.message.param
                    );
                    setFieldErrors(updatedErrors);
                },
                (error) => {
                    if (!error.response) {
                        // network error
                        console.error(error);
                    } else {
                        const uniqueFieldErrors = _.uniqWith(
                            [...fieldErrors, error.response.data.message],
                            _.isEqual
                        );
                        setFieldErrors(uniqueFieldErrors);
                    }
                }
            )
            .catch((err) => {
                console.error("catch err", err);
            });
    };
    return (
        <Container maxWidth="xs">
            {/* <CssBaseline />s */}
            <Typography
                component="h5"
                variant="h5"
                className={classes.pageTitle}
            >
                Myself
            </Typography>
            <form
                className={classes.form}
                noValidate
                onSubmit={(event) => handleFormSubmission(event)}
            >
                <Error errors={apiErrors} />

                <TextField
                    value={firstName}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    id="firstName"
                    label="Your Firstname"
                    name="firstName"
                    autoComplete="firstName"
                    onChange={(event) => setFirstName(event.target.value)}
                    inputProps={{ maxLength: 35 }}
                    helperText={`${
                        firstName.length >= 35
                            ? "Enter a first name between 35 character"
                            : ""
                    }`}
                />
                <TextField
                    value={lastName}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    id="lastName"
                    label="Your Lastname"
                    name="lastName"
                    autoComplete="lastName"
                    onChange={(event) => setLastName(event.target.value)}
                    inputProps={{ maxLength: 35 }}
                    helperText={`${
                        lastName.length >= 35
                            ? "Enter a last name between 35 character"
                            : ""
                    }`}
                />
                <TextFieldWithError
                    id="userEmail"
                    fieldName="email"
                    label="Your Email Address"
                    value={email}
                    handleOnChange={(event) => setEmail(event.target.value)}
                    handleOnBlur={(event) =>
                        handleAjaxValidation(event, "users")
                    }
                    errors={getFieldError("users", "email")}
                    inputProps={{ maxLength: 255 }}
                    helperText={`${
                        email.length >= 255
                            ? "Enter an email between 255 character"
                            : ""
                    }`}
                />

                <TextFieldWithError
                    fieldName="password"
                    label="Your Password"
                    type="password"
                    value={password}
                    handleOnChange={(event) => setPassword(event.target.value)}
                    handleOnBlur={(event) => validatePassword(event)}
                    errors={getFieldError("users", "password")}
                    inputProps={{ maxLength: 90 }}
                    helperText={`${
                        password.length >= 90
                            ? "Enter a password between 90 character"
                            : ""
                    }`}
                />

                <Button
                    disabled={fieldErrors.length > 0}
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    type="submit"
                >
                    <SaveIcon /> Save
                </Button>
            </form>
        </Container>
    );
}

export default MySelf;

/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */

import React, { useState } from "react";

import _ from "lodash";

import AuthService from "../../../services/auth.service";
import TextFieldWithError from "./TextFieldWithError";
import { makeStyles } from "@mui/styles";
import { Alert, Button, TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    form: {
        width: "100%", // Fix IE 11 issue.
        textAlign: "center",
        marginTop: theme.spacing(3),
        border: "1px solid",
        borderColor: theme.borderColor,
        borderRadius: "2px",
        padding: theme.spacing(4),
    },
    checkbox: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const PracticeForm = ({ onFormSubmit, ...props }) => {
    const { errors } = props;
    const classes = useStyles();
    const [clientName, setClientName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState([]);

    const handleFormSubmission = (e) => {
        e.preventDefault();

        const formData = {
            clientName: clientName.trim(),
            firstname: firstName.trim(),
            lastname: lastName.trim(),
            email: email.trim(),
            password: password.trim(),
        };

        onFormSubmit(formData);
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

        AuthService.validate({
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
        <form
            className={classes.form}
            noValidate
            onSubmit={(event) => handleFormSubmission(event)}
        >
            {errors &&
                // eslint-disable-next-line react/no-array-index-key
                errors.map((error, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Alert severity="error" key={index}>
                        {error.msg}
                    </Alert>
                ))}

            <TextFieldWithError
                fieldName="name"
                label="Client Name"
                value={clientName}
                autoFocus
                handleOnChange={(event) => setClientName(event.target.value)}
                handleOnBlur={(event) => handleAjaxValidation(event)}
                errors={getFieldError("client", "name")}
                inputProps={{ maxLength: 35 }}
                helperText={`${
                    clientName.length >= 35
                        ? "Enter a name between 35 character"
                        : ""
                }`}
            />
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
                handleOnBlur={(event) => handleAjaxValidation(event, "users")}
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
                Sign up
            </Button>
        </form>
    );
};

export default PracticeForm;

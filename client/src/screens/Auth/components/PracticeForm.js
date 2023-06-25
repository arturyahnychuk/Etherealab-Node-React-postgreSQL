/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */

import React, { useState, useEffect } from "react";

import _ from "lodash";

import AuthService from "../../../services/auth.service";
import * as API from "../../../utils/API";
import {
    getAcronym,
    removeSpecialCharFromString,
} from "../../../utils/helpers";
import CommonModal from "../../Modal";
import TextFieldWithError from "./TextFieldWithError";
import { makeStyles } from "@mui/styles";
import {
    Alert,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    formSectionTitle: {
        marginBottom: theme.spacing(1),
    },
    personalFormTitle: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    checkbox: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    meta: {
        textAlign: "right",
        "& a": {
            color: theme.palette.text.secondary,
            fontSize: 12,
        },
    },
}));

const PracticeForm = ({ onFormSubmit, ...props }) => {
    const { errors } = props;
    const classes = useStyles();
    const [clientName, setClientName] = useState("");
    const [phone, setPhone] = useState("");
    const [url, setUrl] = useState("");
    const [clientCode, setClientCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAndConditions, setTermsAndConditions] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [fieldErrors, setFieldErrors] = useState([]);
    const [agreement, setAgreement] = useState("");

    const modalTitle = "Customer Agreement";

    useEffect(() => {
        const nameWithoutSpeChar = removeSpecialCharFromString(clientName);
        const clientCodeAcc = getAcronym(nameWithoutSpeChar.trim());
        setClientCode(clientCodeAcc);
    }, [clientName]);

    useEffect(() => {
        async function fetchAgreement() {
            await API.fetchClientAgreement().then((res) => {
                setAgreement(res.data.contract);
            });
        }
        fetchAgreement();
    }, []);

    const handleFormSubmission = (e) => {
        e.preventDefault();

        const formData = {
            client: {
                name: clientName.trim(),
                // address: address.trim(),
                // address2: address2.trim(),
                // city: city.trim(),
                // state: state.trim(),
                // postal: zipCode.trim(),
                phone: phone.trim(),
                // fax: fax.trim(),
                // email: practiceEmail.trim(),
                website: url.trim(),
                // ein: ein.trim(),
                // npi: npi.trim(),
                code: clientCode.trim(),
            },
            user: {
                firstname: firstName.trim(),
                lastname: lastName.trim(),
                email: email.trim(),
                // npi: personalNPI.trim(),
                // medical_license: medicalLicenseNumber.trim(),
                password: password.trim(),
            },
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

    const practiceErrors =
        Array.isArray(errors) &&
        errors.filter((err) => err?.param.includes("client"));
    const userErrors =
        Array.isArray(errors) &&
        errors.filter((err) => err?.param.includes("user"));

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

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <form
            className={classes.form}
            noValidate
            onSubmit={(event) => handleFormSubmission(event)}
        >
            {practiceErrors &&
                // eslint-disable-next-line react/no-array-index-key
                practiceErrors.map((error, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Alert severity="error" key={index}>
                        {error.msg}
                    </Alert>
                ))}
            {modalOpen ? (
                <CommonModal
                    title={modalTitle}
                    body={agreement}
                    isModalOpen
                    isModalClose={handleModalClose}
                />
            ) : null}
            <Typography
                component="h3"
                variant="h4"
                color="textPrimary"
                className={classes.personalFormTitle}
            >
                Your Personal Information
            </Typography>
            {userErrors &&
                userErrors.map((error, index) => (
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
                        ? "Enter a name between 35 charecter"
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
                        ? "Enter a first name between 35 charecter"
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
                        ? "Enter a last name between 35 charecter"
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
                        ? "Enter an email between 255 charecter"
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
                        ? "Enter a password between 90 charecter"
                        : ""
                }`}
            />
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={
                    <div>
                        <span>
                            Check here to indicate that you have read and agree
                            to the terms of the{" "}
                            <a
                                style={{ color: "#2979ff" }}
                                onClick={handleModalOpen}
                            >
                                Customer Agreement
                            </a>
                        </span>
                    </div>
                }
                className={classes.checkbox}
                onChange={() => setTermsAndConditions(!termsAndConditions)}
            />
            <Button
                disabled={fieldErrors.length > 0 || !termsAndConditions}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
            >
                Sign up
            </Button>
            <Grid container className={classes.meta}>
                <Grid item xs>
                    <Link href="/login_client" variant="body2">
                        Already a member? Login here
                    </Link>
                </Grid>
            </Grid>
        </form>
    );
};

export default PracticeForm;

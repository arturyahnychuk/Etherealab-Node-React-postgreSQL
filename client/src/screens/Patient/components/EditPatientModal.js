import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModelHeader from "../../../components/common/ModelHeader";
import TextFieldWithError from "../../../components/common/TextFieldWithError";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import { useSnackbar } from "notistack";
import axios from "axios";
import { API_BASE } from "../../../utils/constants";
import authHeader from "../../../utils/helpers";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    editPatientContainer: {
        minWidth: "550px",
        padding: theme.spacing(3),
        "& input": {
            maxWidth: "250px !important",
            padding: theme.spacing(1.5),
        },
    },
    customButton: {
        color: theme.palette.black + " !important",
        textTransform: "none !important",
        borderColor: theme.palette.black + " !important",
        marginTop: theme.spacing(2) + " !important",
    },
    names: {
        display: "block !important",
    },
    disabled: {
        pointerEvents: "none",
        borderColor: theme.palette.divider + " !important",
        color: theme.palette.text.secondary + " !important",
    },
}));

async function updatePatientRequest(patientId, data) {
    const res = await axios.put(
        `${API_BASE}/patient/${patientId}/update-patient`,
        data,
        { headers: authHeader() }
    );
    return res.data;
}
async function validatePatientEmailRequest(data) {
    return await axios.post(`${API_BASE}/patient/email/validate`, data, {
        headers: authHeader(),
    });
}
function EditPatientModal(props) {
    const classes = useStyles();
    const { onClose, patient, setPatient } = props;
    const inputRef = useRef(null);
    const [firstName, setFirstName] = useState(patient.firstname);
    const [lastName, setLastName] = useState(patient.lastname);
    const [email, setEmail] = useState(patient.email);
    const [fieldErrors, setFieldErrors] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const getFieldError = (target, fieldName) => {
        let value = `client.${fieldName}`;
        if (target) {
            value = `${target}.${fieldName}`;
        }
        return fieldErrors && fieldErrors.filter((err) => err?.param === value);
    };
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    const validateEmail = (event) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const isValid = emailRegex.test(event.target.value);

        if (!isValid) {
            setFieldErrors([
                ...fieldErrors,
                {
                    value: event.target.value,
                    msg: "Invalid email address",
                    param: "patient.email",
                },
            ]);
        } else {
            const updatedErrors = fieldErrors.filter(
                (error) => error.param !== "patient.email"
            );
            setFieldErrors(updatedErrors);
        }
        return isValid;
    };
    const handleAjaxValidation = async (event, target) => {
        if (!event.target) {
            return;
        }

        if (!validateEmail(event)) {
            return;
        }

        try {
            await validatePatientEmailRequest({
                email: event.target.value.trim().toLowerCase(),
            });
            const updatedErrors = fieldErrors.filter(
                (error) => error.param !== "patient.email"
            );
            setFieldErrors(updatedErrors);
        } catch (error) {
            if (!error.response) {
                console.error(error);
            } else {
                const uniqueFieldErrors = _.uniqWith(
                    [...fieldErrors, error.response.data.message],
                    _.isEqual
                );
                setFieldErrors(uniqueFieldErrors);
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const data = {
            firstname: firstName.trim(),
            lastname: lastName.trim(),
            email: email.trim(),
        };
        try {
            const res = await updatePatientRequest(patient.id, data);
            enqueueSnackbar(res.message, {
                variant: "success",
            });
            setPatient({ ...patient, ...data });
            onClose();
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: "error",
            });
        }
    };
    function isDisabled() {
        return (
            lastName === patient.lastName &&
            firstName === patient.firstName &&
            email === patient.email
        );
    }
    return (
        <>
            <ModelHeader onClose={onClose} title="Edit Patient" />
            <Box className={classes.editPatientContainer}>
                <form onSubmit={handleFormSubmit} noValidate>
                    <TextField
                        value={firstName}
                        variant="outlined"
                        inputRef={inputRef}
                        autoFocus
                        margin="dense"
                        className={classes.names}
                        id="firstName"
                        label="Firstname"
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
                        className={classes.names}
                        id="lastName"
                        label="Lastname"
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
                        id="patientEmail"
                        fieldName="email"
                        label="Email"
                        value={email}
                        handleOnChange={(event) => setEmail(event.target.value)}
                        handleOnBlur={(event) =>
                            handleAjaxValidation(event, "patient")
                        }
                        errors={getFieldError("patient", "email")}
                        inputProps={{ maxLength: 255 }}
                        helperText={`${
                            email.length >= 255
                                ? "Enter an email between 255 character"
                                : ""
                        }`}
                    />

                    <Button
                        variant="outlined"
                        className={
                            isDisabled()
                                ? clsx(classes.customButton, classes.disabled)
                                : classes.customButton
                        }
                        disabled={isDisabled()}
                        type="submit"
                    >
                        Save
                    </Button>
                </form>
            </Box>
        </>
    );
}

export default EditPatientModal;

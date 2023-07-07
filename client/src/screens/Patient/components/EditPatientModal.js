import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import ModelHeader from "../../../components/common/ModelHeader";
import TextFieldWithError from "../../../components/common/TextFieldWithError";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import patientService from "../../../services/patient.service";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
    editPatientContainer: {
        minWidth: "550px",
        // minHeight: "300px",
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
}));
function EditPatientModal(props) {
    const classes = useStyles();
    const { onClose } = props;
    const [firstName, setFirstName] = useState(props.firstName);
    const [lastName, setLastName] = useState(props.lastName);
    const [email, setEmail] = useState(props.email);
    const [fieldErrors, setFieldErrors] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const getFieldError = (target, fieldName) => {
        let value = `client.${fieldName}`;
        if (target) {
            value = `${target}.${fieldName}`;
        }
        return fieldErrors && fieldErrors.filter((err) => err?.param === value);
    };
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
            await patientService.validate({
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
            const res = await patientService.updatePatient(
                props.patientId,
                data
            );
            enqueueSnackbar(res.message, {
                variant: "success",
            });
            onClose();
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: "error",
            });
        }
    };

    return (
        <>
            <ModelHeader onClose={onClose} title="Edit Patient" />
            <Box className={classes.editPatientContainer}>
                <TextField
                    value={firstName}
                    variant="outlined"
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
                    className={classes.customButton}
                    disabled={
                        lastName === props.lastName &&
                        firstName === props.firstName &&
                        email === props.email
                    }
                    onClick={handleFormSubmit}
                >
                    Save
                </Button>
            </Box>
        </>
    );
}

export default EditPatientModal;
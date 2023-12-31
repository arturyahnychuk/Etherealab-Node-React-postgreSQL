import { Button, Container, TextField, Typography } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import SaveIcon from "@mui/icons-material/Save";
import { useSnackbar } from "notistack";

import TextFieldWithError from "../components/common/TextFieldWithError";
import useAuth from "../hooks/useAuth";
import Error from "../components/common/Error";
import useEffectOnce from "../hooks/useEffectOnce";
import axios from "axios";
import { API_BASE } from "../utils/constants";
import _ from "lodash";
import authHeader from "../utils/helpers";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(2),
    },
    pageTitle: {
        marginBottom: theme.spacing(3),
    },
    form: {
        width: "50%", // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    container: {
        marginLeft: theme.spacing(2) + "!important",
    },
    submit: {
        margin: `${theme.spacing(3, 0, 2)} !important`,
    },
}));

async function validateRequest(data) {
    return await axios.post(`${API_BASE}/auth/field/validate`, data);
}

async function getProfileRequest() {
    const res = await axios.get(`${API_BASE}/myself/profile`, {
        headers: authHeader(),
    });
    return res.data;
}
async function updateProfileRequest(payload, userId) {
    return await axios.put(`${API_BASE}/myself/profile/${userId}`, payload, {
        headers: authHeader(),
    });
}
function Myself() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState([]);
    const [apiErrors, setApiErrors] = useState([]);

    const formRef = useRef(null);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (fieldErrors.length > 0 && !email && !lastName && !firstName)
                formRef.current.dispatchEvent(new Event("submit"));
        }
    };

    const handleFormSubmission = (e) => {
        e.preventDefault();
        try {
            const payload = {
                data: {
                    firstname: firstName.trim(),
                    lastname: lastName.trim(),
                    email: email.trim(),
                    password: password,
                },
            };

            updateProfileRequest(payload, user.id).then(
                (res) => {
                    enqueueSnackbar(res.data.message, {
                        variant: "success",
                    });
                },
                () => {
                    enqueueSnackbar("Unable to update profile", {
                        variant: "error",
                    });
                }
            );
        } catch (error) {
            enqueueSnackbar("Unable to login", {
                variant: "error",
            });
            setApiErrors([
                {
                    msg: error.message,
                },
            ]);
        }
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
    const handleAjaxValidation = async (event, target) => {
        if (!event.target) {
            return;
        }

        if (
            event.target.name === "email" &&
            event.target.value === user.email
        ) {
            // Skip validation if the field is email and value matches user email
            return;
        }

        try {
            const response = await validateRequest({
                fieldName: event.target.name,
                value: event.target.value,
                target: target || "client",
            });

            // Remove errors record with param
            const updatedErrors = fieldErrors.filter(
                (error) => error.param !== response.data.message.param
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
    const getProfile = useCallback(async () => {
        try {
            const res = await getProfileRequest();
            setFirstName(res.data.firstname);
            setLastName(res.data.lastname);
            setEmail(res.data.email);
        } catch (error) {
            setFirstName("");
            setLastName("");
            setEmail("");
        }
    }, []);

    useEffectOnce(() => {
        getProfile();
    }, [getProfile]);

    return (
        <Container className={classes.container}>
            <Typography
                component="h5"
                variant="h5"
                className={classes.pageTitle}
            >
                Myself
            </Typography>
            <form
                ref={formRef}
                className={classes.form}
                noValidate
                onSubmit={(event) => handleFormSubmission(event)}
                onKeyUp={(event) => handleKeyPress(event)}
            >
                <Error errors={apiErrors} />
                <TextField
                    value={firstName}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    id="firstName"
                    label="Firstname"
                    name="firstName"
                    autoComplete="firstName"
                    autoFocus
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
                    id="userEmail"
                    fieldName="email"
                    label="Email"
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
                    label="Password"
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
                    disabled={
                        fieldErrors.length > 0 ||
                        !email ||
                        !lastName ||
                        !firstName
                    }
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

export default Myself;

import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { Button, Container, TextField, Typography } from "@mui/material";
import Error from "../../components/common/Error";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import SaveIcon from "@mui/icons-material/Save";
import useAuth from "../../hooks/useAuth";
import useEffectOnce from "../../hooks/useEffectOnce";
import { API_BASE } from "../../utils/constants";
import authHeader from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
    pageTitle: {
        marginBottom: theme.spacing(3),
    },
    container: {
        marginLeft: theme.spacing(2) + "!important",
    },
    form: {
        width: "50%", // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: `${theme.spacing(3, 0, 2)} !important`,
    },
}));
function getClientRequest(clientId) {
    return axios.get(`${API_BASE}/client/${clientId}`, {
        headers: authHeader(),
    });
}
function updateClientRequest(payload, clientId) {
    return axios.put(`${API_BASE}/client/profile/${clientId}`, payload, {
        headers: authHeader(),
    });
}
function ClientProfile() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();

    const [apiErrors, setApiErrors] = useState([]);
    const [name, setName] = useState("");
    const [license, setLicense] = useState("");

    const formRef = useRef(null);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!name && !license)
                formRef.current.dispatchEvent(new Event("submit"));
        }
    };
    const onFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                name: name.trim(),
                license: license.trim(),
            };
            updateClientRequest(payload, user.client_id).then(
                (res) => {
                    enqueueSnackbar(res.data.message, {
                        variant: "success",
                    });
                },
                () => {
                    enqueueSnackbar("Unable to update Client", {
                        variant: "error",
                    });
                }
            );
        } catch (error) {
            enqueueSnackbar("Unable to update Client", {
                variant: "error",
            });
            setApiErrors([
                {
                    msg: error.message,
                },
            ]);
        }
    };
    const getClient = useCallback(async (id) => {
        try {
            const res = await getClientRequest(id);
            setName(res.data.data.name);
            setLicense(res.data.data.license || "");
        } catch (error) {
            setName("");
            setLicense("");
        }
    }, []);

    useEffectOnce(() => {
        getClient(user.client_id);
    }, [getClient, user.client_id]);

    return (
        <Container className={classes.container}>
            <Typography
                component="h5"
                variant="h5"
                className={classes.pageTitle}
            >
                Client Profile
            </Typography>
            <Error errors={apiErrors} />

            <form
                className={classes.form}
                noValidate
                onSubmit={(event) => onFormSubmit(event)}
                onKeyUp={(event) => handleKeyPress(event)}
            >
                <TextField
                    value={name}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    id="clinic"
                    label="Clinic Name"
                    name="clinicName"
                    autoComplete="clinicName"
                    autoFocus
                    onChange={(event) => setName(event.target.value)}
                    inputProps={{ maxLength: 255 }}
                    helperText={`${
                        name.length >= 255
                            ? "Enter an name between 255 character"
                            : ""
                    }`}
                />
                <TextField
                    value={license}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    name="license"
                    label="Provider License"
                    type="text"
                    id="license"
                    autoComplete="license"
                    onChange={(event) => setLicense(event.target.value)}
                    inputProps={{ maxLength: 255 }}
                    helperText={`${
                        license.length >= 255
                            ? "Enter a License between 128 character"
                            : ""
                    }`}
                />
                <Button
                    type="submit"
                    disabled={!name || !license}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    <SaveIcon /> Save
                </Button>
            </form>
        </Container>
    );
}

export default ClientProfile;

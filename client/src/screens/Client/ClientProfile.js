import {
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
} from "@mui/material";
import Error from "../../components/common/Error";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import SaveIcon from "@mui/icons-material/Save";
import clientService from "../../services/client.service";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        padding: theme.spacing(2),
    },
    marginTop: {
        marginTop: theme.spacing(16),
    },
    pageTitle: {
        marginBottom: theme.spacing(3),
    },
    container:{
        marginLeft:theme.spacing(2) + '!important'
    },
    form: {
        width: "50%", // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: `${theme.spacing(3, 0, 2)} !important`,
    },
    Logo: {
        maxWidth: "180px",
        width: 170,
        height: 65,
        objectFit: "contain",
    },
}));

function ClientProfile() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();

    const [apiErrors, setApiErrors] = useState([]);
    const [name, setName] = useState("");
    const [license, setLicense] = useState("");

    const onFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                name: name.trim(),
                license: license.trim(),
            };
            clientService.updateClient(payload, user.client_id).then(
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
            console.error(error);
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

    return (
        <Container className={classes.container}>
            <CssBaseline />
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

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
import { useSnackbar } from "notistack";
import useAuth from "../hooks/useAuth";
import SaveIcon from "@mui/icons-material/Save";

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
    form: {
        width: "50%", // Fix IE 11 issue.
        textAlign: "center",
        marginTop: theme.spacing(1),
        border: "1px solid",
        borderColor: theme.borderColor,
        borderRadius: "2px",
        padding: theme.spacing(4),
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

function ClientProfile() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { login } = useAuth();

    const [apiErrors, setApiErrors] = useState([]);
    const [clinicName, setClinicName] = useState("");
    const [license, setLicense] = useState("");

    const onFormSubmit = async (event) => {
        event.preventDefault();
        try {
            // TODO: Call AuthProvider login
        } catch (error) {
            console.error(error);
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

    return (
        <Container component="main">
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
                    value={clinicName}
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    id="clinic"
                    label="Clinic Name"
                    name="clinicName"
                    autoComplete="clinicName"
                    autoFocus
                    onChange={(event) => setClinicName(event.target.value)}
                    inputProps={{ maxLength: 255 }}
                    helperText={`${
                        clinicName.length >= 255
                            ? "Enter an name between 255 character"
                            : ""
                    }`}
                />
                <TextField
                    value={license}
                    variant="outlined"
                    margin="dense"
                    required
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
                    disabled={!clinicName || !license}
                    fullWidth
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

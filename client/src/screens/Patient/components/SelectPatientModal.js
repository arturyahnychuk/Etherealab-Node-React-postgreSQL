import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ModelHeader from "../../../components/common/ModelHeader";
import Search from "../../../components/common/Search";
import patientService from "../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
    selectPatientContainer: {
        position: "relative",
        minWidth: "550px",
        minHeight: "300px",
        padding: theme.spacing(3, 5, 4, 5),
    },
    addButton: {
        position: "absolute !important",
        bottom: theme.spacing(1),
        color: theme.palette.text.primary + "! important",
        fontSize: "17px ! important",
        textTransform: "none ! important",
        padding: theme.spacing(0, 0.5) + "! important",
    },
}));

function SelectPatientModal(props) {
    const classes = useStyles();
    const { onClose, handleAddPatient } = props;
    const [searchText, setSearchText] = useState("");
    const [patients, setPatients] = useState([]);
    const history = useHistory();
    const fetchPatientData = async () => {
        const data = { term: searchText.toLowerCase() };
        try {
            const res = await patientService.getPatients(data);
            setPatients(res.data);
        } catch (error) {
            setPatients([]);
        }
    };
    const onFormSubmit = (e) => {
        e.preventDefault();
        fetchPatientData(searchText);
    };
    const handleSearchClick = () => {
        if (searchText.trim() !== "") {
            onFormSubmit(new Event("submit"));
        }
    };
    const handleSelect = (patientId) => {
        history.push(`/patient/${patientId}/new-order`);
    };
    return (
        <>
            <ModelHeader
                onClose={onClose}
                title="Select or Create New Patient"
            />
            <Box className={classes.selectPatientContainer}>
                <Search
                    placeholderText="Search Patient names..."
                    onFormSubmit={onFormSubmit}
                    handleSearchClick={handleSearchClick}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
                <List>
                    {patients &&
                        patients.length > 0 &&
                        patients.map((patient) => (
                            <ListItem disablePadding key={patient.id}>
                                <ListItemButton
                                    disableGutters
                                    onClick={() => handleSelect(patient.id)}
                                >
                                    <ListItemText
                                        primary={
                                            patient.firstname +
                                            " " +
                                            patient.lastname
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
                <Button
                    variant="text"
                    onClick={() => handleAddPatient("NEW_PATIENT")}
                    className={classes.addButton}
                >
                    Add {searchText} as a Patient
                </Button>
            </Box>
        </>
    );
}

export default SelectPatientModal;

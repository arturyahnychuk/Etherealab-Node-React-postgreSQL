import React, { useState } from "react";
import {
    Button,
    Container,
    Grid,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    StyledTableRowSm,
    StyledTableCellSm,
} from "../../components/common/StyledTable";
import { makeStyles } from "@mui/styles";

import SearchPatient from "../../services/patientSearch.service";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: "20px 0px",
    },
    borderSection: {
        position: "relative",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        padding: theme.spacing(1, 1.5),
        minHeight: 120,
        marginRight: theme.spacing(3),

        [theme.breakpoints.down("sm")]: {
            marginRight: 0,
        },
    },
    link: {
        color: theme.palette.text.primary,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    searchButton: {
        backgroundColor: theme.palette.primary.main + "!important",
    },
    searchWrapper: {
        marginTop: theme.spacing(1) + "!important",
        marginBottom: theme.spacing(4) + "!important",
    },
    iconContainer: {
        "& svg": {
            cursor: "pointer",
            position: "relative",
            top: 3,
        },
    },
}));

const Patient = () => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const searchPatientHandler = (searchText) => {
        setIsLoading(true);
        const payload = {
            searchTerm: searchText,
        };
        SearchPatient.search(payload).then((res) => {
            setSearchResults(res.data.data);
        });
        setIsLoading(false);
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        searchPatientHandler(searchText);
    };

    return (
        <Container>
            <Typography component="h5" variant="h5">
                Dashboard
            </Typography>
            <form onSubmit={onFormSubmit}>
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    className={classes.searchWrapper}
                >
                    <Grid item>
                        <TextField
                            autoFocus
                            size="small"
                            name="name"
                            label="Name"
                            variant="outlined"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            className={classes.searchButton}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <TableContainer>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCellSm>Firstname</StyledTableCellSm>
                            <StyledTableCellSm>Lastname</StyledTableCellSm>
                            <StyledTableCellSm>Status</StyledTableCellSm>
                            <StyledTableCellSm>Created</StyledTableCellSm>
                            <StyledTableCellSm>Updated</StyledTableCellSm>
                            <StyledTableCellSm>View</StyledTableCellSm>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!isLoading && searchResults.length ? (
                            searchResults.map((item) => (
                                <StyledTableRowSm
                                    key={item.proc_id}
                                    className={classes.pointer}
                                >
                                    <StyledTableCellSm>
                                        {item.firstname}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.lastname}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.status}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.createdAt}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.updatedAt}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.view}
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            ))
                        ) : (
                            <StyledTableRowSm>
                                <StyledTableCellSm colSpan={4}>
                                    <Typography align="center" variant="body1">
                                        {isLoading
                                            ? "Loading..."
                                            : "No Records Found..."}
                                    </Typography>
                                </StyledTableCellSm>
                            </StyledTableRowSm>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Patient;

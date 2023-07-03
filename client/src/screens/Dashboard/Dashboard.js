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

import DashboardService from "../../services/dashboard.service";
import useEffectOnce from "../../hooks/useEffectOnce";

const useStyles = makeStyles((theme) => ({
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
    container: {
        marginLeft: theme.spacing(2) + "!important",
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
        marginTop: theme.spacing(2) + "!important",
        marginBottom: theme.spacing(4) + "!important",
    },
}));

const Patient = () => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const searchHandler = (searchText) => {
        setIsLoading(true);
        const payload = {
            searchTerm: searchText.trim(),
        };
        DashboardService.search(payload).then((res) => {
            setSearchResults(res.data.data);
        });
        setIsLoading(false);
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        searchHandler(searchText);
    };

    useEffectOnce(() => {
        searchHandler("");
    }, []);

    return (
        <Container className={classes.container}>
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
                            label="Patient"
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
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCellSm>Firstname</StyledTableCellSm>
                            <StyledTableCellSm>Lastname</StyledTableCellSm>
                            <StyledTableCellSm>Status</StyledTableCellSm>
                            <StyledTableCellSm>Created</StyledTableCellSm>
                            <StyledTableCellSm>Updated</StyledTableCellSm>
                            <StyledTableCellSm>View</StyledTableCellSm>
                            <StyledTableCellSm>New Order</StyledTableCellSm>
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
                                        {item.created || ""}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        {item.updated}
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        View Order
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        New Order
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

import React, { useCallback, useEffect, useRef, useState } from "react";

import {
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    Container,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import {
    StyledTableRowSm,
    StyledTableCellSm,
} from "../../components/common/StyledTable";
import ModelPopup from "../../components/ModelPopup";
import CatalogService from "../../services/catalog.service";
import DetailToolTip from "./components/DetailToolTip";
import useEffectOnce from "../../hooks/useEffectOnce";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
    },
    pageTitle: {
        marginBottom: theme.spacing(3) + "!important",
    },
    border: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
    },
    label: {
        "& span": {
            fontSize: "13px",
        },
    },
    accordion: {
        boxShadow: "none !important",
        "& .MuiAccordionDetails-root": {
            padding: theme.spacing(0, 2),
        },
    },
    topSection: {
        display: "flex",
        paddingBottom: theme.spacing(1),
        justifyContent: "space-between",
        alignItems: "end",
    },
    filterButton: {
        padding: theme.spacing(0) + " !important",
        color: theme.palette.primary.main + " !important",
        textTransform: "Capitalize !important",
        fontSize: "12px !important",
    },
    link: {
        color: theme.palette.text.primary,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },

    iconContainer: {
        "& svg": {
            cursor: "pointer",
            position: "relative",
            top: 3,
        },
    },
}));

const Catalog = () => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [catalog, setCatalog] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [catalogLabCompanies, setCatalogLabCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [favoriteOnly, setFavoriteOnly] = useState(false);

    const debouncedSearchTerm = useDebounce(searchText, 500);

    const fetchCatalogData = useCallback(
        (text) => {
            setIsLoading(true);
            const reqBody = {
                data: {
                    text,
                    labCompanyId: selectedCompanies.length
                        ? selectedCompanies
                        : null,
                    favorite: favoriteOnly,
                },
            };
            CatalogService.searchCatalog(reqBody)
                .then((res) => {
                    setCatalog(res.data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        },
        [favoriteOnly, selectedCompanies]
    );

    const fetchLabCompanies = useCallback(async (id) => {
        setIsLoading(true);

        try {
            const res = await CatalogService.getLabCompanies();
            setCatalogLabCompanies(res.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }, []);

    const updateCatalogItem = (labCompanyTestId, favoriteId) => {
        setCatalog((prevCatalog) => {
            return prevCatalog.map((item) => {
                if (item.lab_company_test_id === labCompanyTestId) {
                    return { ...item, favorite_id: favoriteId };
                }
                return item;
            });
        });
    };

    const handleFavorite = (favoriteId, labCompanyTestId) => {
        if (favoriteId) {
            CatalogService.removeFavorite(labCompanyTestId)
                .then(() => updateCatalogItem(labCompanyTestId, null))
                .catch(() => setIsLoading(false));
        } else {
            CatalogService.addFavorite({ labCompanyTestId })
                .then((res) =>
                    updateCatalogItem(
                        labCompanyTestId,
                        res.data.data.lab_company_test_id
                    )
                )
                .catch(() => setIsLoading(false));
        }
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        fetchCatalogData(debouncedSearchTerm);
    };

    const dataFetch = useRef(false);
    useEffect(() => {
        if (dataFetch.current) return fetchCatalogData(searchText);
        dataFetch.current = true;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompanies, favoriteOnly]);

    useEffectOnce(() => {
        fetchLabCompanies();
    }, []);

    const onCheckBoxChangeHandler = (e) => {
        const tempSelectedCompanies = [...selectedCompanies];
        if (e.target.checked) {
            tempSelectedCompanies.push(e.target.name);
            setSelectedCompanies([...tempSelectedCompanies]);
        } else {
            const index = selectedCompanies.findIndex(
                (x) => x === e.target.name
            );
            tempSelectedCompanies.splice(index, 1);
            setSelectedCompanies([...tempSelectedCompanies]);
        }
    };
    const handleModelPopOpen = (lab) => {
        setSelectedItem(lab);
    };

    const handleClearFilter = () => {
        setSelectedCompanies([]);
        setFavoriteOnly(false);
        setSearchText("");
    };

    const handleSearchClick = () => {
        if (searchText.trim() !== "") {
            onFormSubmit(new Event("submit"));
        }
    };
    return (
        <Container className={classes.container}>
            <Typography
                component="h5"
                variant="h5"
                className={classes.pageTitle}
            >
                Catalog
            </Typography>
            <Box className={classes.topSection}>
                <Button
                    className={classes.filterButton}
                    onClick={handleClearFilter}
                >
                    Clear All Filters
                </Button>
                <form onSubmit={onFormSubmit}>
                    <TextField
                        autoFocus
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Search test names..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        size="small"
                                        aria-label="search"
                                        onSubmit={handleSearchClick}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </form>
            </Box>
            <Grid container spacing={2}>
                <Grid item sm={3} xs={12}>
                    <Box className={classes.border} mb={1} pl={2}>
                        <FormControlLabel
                            label="Favorites Only"
                            className={classes.label}
                            control={
                                <Checkbox
                                    name="favorite"
                                    color="primary"
                                    size="small"
                                    checked={favoriteOnly}
                                    onChange={() =>
                                        setFavoriteOnly(!favoriteOnly)
                                    }
                                />
                            }
                        />
                    </Box>
                    <Box className={classes.border}>
                        <Accordion
                            className={classes.accordion}
                            defaultExpanded
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography
                                    component="h6"
                                    color="textPrimary"
                                    className={classes.title}
                                    gutterBottom
                                >
                                    Lab Company
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {catalogLabCompanies &&
                                    catalogLabCompanies.length > 0 &&
                                    catalogLabCompanies.map((item) => (
                                        <Grid key={item.id}>
                                            <FormControlLabel
                                                value={item.id.toString()}
                                                label={item.name}
                                                className={classes.label}
                                                control={
                                                    <Checkbox
                                                        name={item.id.toString()}
                                                        color="primary"
                                                        size="small"
                                                        checked={selectedCompanies.includes(
                                                            item.id.toString()
                                                        )}
                                                        onChange={(e) =>
                                                            onCheckBoxChangeHandler(
                                                                e
                                                            )
                                                        }
                                                    />
                                                }
                                            />
                                        </Grid>
                                    ))}
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
                <Grid item sm={9} xs={12}>
                    <TableContainer className={classes.border}>
                        <Table
                            stickyHeader
                            size="small"
                            className={classes.table}
                        >
                            <TableHead>
                                <StyledTableRowSm>
                                    <StyledTableCellSm>
                                        Lab Company
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Test Name
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Sample
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>Price</StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Favorite
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Detail
                                    </StyledTableCellSm>
                                </StyledTableRowSm>
                            </TableHead>
                            <TableBody>
                                {!isLoading && catalog.length > 0 ? (
                                    catalog.map((item, idx) => (
                                        <StyledTableRowSm key={idx}>
                                            <StyledTableCellSm>
                                                {item.lab_company_name}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm>
                                                {item.lab_company_test_name}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm>
                                                {item.sample_type_name}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm>
                                                &#36;{item.test_price}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleFavorite(
                                                            item.favorite_id,
                                                            item.lab_company_test_id
                                                        )
                                                    }
                                                >
                                                    {item.favorite_id ? (
                                                        <GradeIcon />
                                                    ) : (
                                                        <GradeOutlinedIcon />
                                                    )}
                                                </IconButton>
                                            </StyledTableCellSm>

                                            <StyledTableCellSm
                                                onClick={() =>
                                                    handleModelPopOpen(item)
                                                }
                                                className={
                                                    classes.iconContainer
                                                }
                                            >
                                                <ModelPopup
                                                    bodyElement={
                                                        selectedItem ? (
                                                            <DetailToolTip
                                                                data={
                                                                    selectedItem
                                                                }
                                                            />
                                                        ) : (
                                                            ""
                                                        )
                                                    }
                                                >
                                                    <IconButton size="small">
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </ModelPopup>
                                            </StyledTableCellSm>
                                        </StyledTableRowSm>
                                    ))
                                ) : (
                                    <StyledTableRowSm>
                                        <StyledTableCellSm colSpan={4}>
                                            <Typography
                                                align="center"
                                                variant="body1"
                                            >
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
                </Grid>
            </Grid>
        </Container>
    );
};

Catalog.propTypes = {};

export default Catalog;

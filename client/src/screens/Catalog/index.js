import React, { useCallback, useEffect, useRef, useState } from "react";

import {
    Box,
    Grid,
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    Container,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";

import useEffectOnce from "../../hooks/useEffectOnce";
import useDebounce from "../../hooks/useDebounce";
import LabCompanies from "../../components/LabCompanies";
import Search from "../../components/common/Search";
import ModalPopup from "../../components/ModalPopup";

import {
    StyledTableCellSm,
    StyledTableRowSm,
} from "../../components/common/StyledTable";
import DetailModal from "./components/DetailModal";
import axios from "axios";
import { API_BASE } from "../../utils/constants";
import authHeader from "../../utils/helpers";

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
            padding: theme.spacing(0, 1),
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
        color: theme.palette.text.secondary + " !important",
        textTransform: "none !important",
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
async function searchCatalog(data) {
    const res = await axios.post(`${API_BASE}/catalog/search`, data, {
        headers: authHeader(),
    });
    return res.data;
}
async function getLabCompanies() {
    const res = await axios.get(`${API_BASE}/catalog/lab-companies`, {
        headers: authHeader(),
    });
    return res.data;
}
async function addFavorite(data) {
    return axios.post(`${API_BASE}/catalog/lab-company/favorite`, data, {
        headers: authHeader(),
    });
}
async function removeFavorite(id) {
    return axios.delete(`${API_BASE}/catalog/lab-company/favorite/${id}`, {
        headers: authHeader(),
    });
}
const Catalog = () => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [catalog, setCatalog] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [catalogLabCompanies, setCatalogLabCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [favoriteOnly, setFavoriteOnly] = useState(false);

    const dataFetch = useRef(false);
    const inputRef = useRef(null);

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
            searchCatalog(reqBody)
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
            const res = await getLabCompanies();
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
            removeFavorite(labCompanyTestId)
                .then(() => updateCatalogItem(labCompanyTestId, null))
                .catch(() => setIsLoading(false));
        } else {
            addFavorite({ labCompanyTestId })
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
    const handleShowDetails = (lab) => {
        setSelectedItem(lab);
    };

    const handleClearFilter = () => {
        setSelectedCompanies([]);
        setFavoriteOnly(false);
        setSearchText("");
        inputRef.current.focus();
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
                <Search
                    placeholderText="Search test names..."
                    onFormSubmit={onFormSubmit}
                    handleSearchClick={handleSearchClick}
                    inputRef={inputRef}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
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

                    <LabCompanies
                        catalogLabCompanies={catalogLabCompanies}
                        selectedCompanies={selectedCompanies}
                        onCheckBoxChangeHandler={onCheckBoxChangeHandler}
                    />
                </Grid>
                <Grid item sm={9} xs={12}>
                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <StyledTableRowSm>
                                    <StyledTableCellSm>
                                        Lab Company
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Test Name
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Favorite
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>
                                        Sample
                                    </StyledTableCellSm>
                                    <StyledTableCellSm>Price</StyledTableCellSm>
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

                                            <StyledTableCellSm>
                                                {item.sample_type_name}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm>
                                                &#36;{item.test_price}
                                            </StyledTableCellSm>
                                            <StyledTableCellSm
                                                onClick={() =>
                                                    handleShowDetails(item)
                                                }
                                                className={
                                                    classes.iconContainer
                                                }
                                            >
                                                <ModalPopup
                                                    bodyElement={
                                                        selectedItem ? (
                                                            <DetailModal
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
                                                </ModalPopup>
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

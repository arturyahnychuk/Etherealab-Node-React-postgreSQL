import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import SelectPatientModal from "./component/SelectPatientModal";
import ModelBody from "../../components/common/ModelBody";
import NewPatientModal from "./component/NewPatientModal";
import {
    Breadcrumbs,
    Button,
    Container,
    Grid,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import TestTable from "../../components/TestTable";
import catalogService from "../../services/catalog.service";
import Search from "../../components/common/Search";
import LabCompanies from "../../components/LabCompanies";
import OrderSuccessModal from "./component/OrderSuccessModal";
import Orders from "./component/Orders";
import CancelOrderModal from "./component/CancelOrderModal";
import orderService from "../../services/order.service";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
    },
    customButton: {
        color: theme.palette.black + " !important",
        textTransform: "Capitalize !important",
        borderColor: theme.palette.black + " !important",
    },
    buttons: {
        display: "flex",
        gap: theme.spacing(3),
        justifyContent: "center",
        marginTop: theme.spacing(2),
    },
    searchContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    border: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
    },
    testsContainer: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        padding: theme.spacing(1, 2),
    },

    filterButton: {
        padding: theme.spacing(0) + " !important",
        color: theme.palette.black + " !important",
        textTransform: "none !important",
        fontSize: "15px !important",
        marginBottom: theme.spacing(1) + " !important",
    },
}));

export const StepEnum = {
    SEARCH: "search",
    NEW_PATIENT: "new-patient",
    ORDERS: "orders",
    DASHBOARD: "dashboard",
};

const Order = () => {
    const classes = useStyles();
    const [openedModal, setOpenedModal] = useState(StepEnum.SEARCH);
    const [catalog, setCatalog] = useState([]);
    const [favoriteCatalog, setFavoriteCatalog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [catalogLabCompanies, setCatalogLabCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [patient, setPatient] = useState(null);
    const [orders, setOrders] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [cancelOrder, setCancelOrder] = useState(false);

    const history = useHistory();

    function handleClick(event) {
        event.preventDefault();
        // TODO: handle breadcrumb
    }
    const fetchCatalogData = useCallback(
        async (text) => {
            setIsLoading(true);
            const reqBody = {
                data: {
                    text,
                    labCompanyId: selectedCompanies.length
                        ? selectedCompanies
                        : null,
                },
            };
            try {
                const res = await catalogService.searchCatalog(reqBody);
                const { data } = res;
                if (data && Array.isArray(data)) {
                    const favoriteCatalogs = data.filter(
                        (item) => item.favorite_id !== null
                    );
                    const normalCatalogs = data.filter(
                        (item) => item.favorite_id === null
                    );
                    setFavoriteCatalog(favoriteCatalogs);
                    setCatalog(normalCatalogs);
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedCompanies]
    );

    const fetchLabCompanies = useCallback(async (id) => {
        setIsLoading(true);

        try {
            const res = await catalogService.getLabCompanies();
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
            catalogService
                .removeFavorite(labCompanyTestId)
                .then(() => updateCatalogItem(labCompanyTestId, null))
                .catch(() => setIsLoading(false));
        } else {
            catalogService
                .addFavorite({ labCompanyTestId })
                .then((res) =>
                    updateCatalogItem(
                        labCompanyTestId,
                        res.data.data.lab_company_test_id
                    )
                )
                .catch(() => setIsLoading(false));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchText.trim() !== "") {
            fetchCatalogData(searchText.trim());
        }
    };
    const handleSearchClick = () => {
        if (searchText.trim() !== "") {
            handleSearch(new Event("submit"));
        }
    };
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
    const handleNext = (step, patient = null) => {
        if (step === StepEnum.DASHBOARD) {
            return history.push("/dashboard");
        }
        setOpenedModal(step);
        if (step === StepEnum.ORDERS) {
            setPatient(patient);
            fetchLabCompanies();
            fetchCatalogData("");
        }
    };

    const dataFetch = useRef(false);
    useEffect(() => {
        if (dataFetch.current && patient) {
            fetchCatalogData(searchText);
        }
        dataFetch.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCompanies]);

    const handleAddOrder = (item) => {
        const orderIndex = orders.findIndex(
            (order) => order.lab_company_test_id === item.lab_company_test_id
        );

        let updatedOrders;

        if (orderIndex >= 0) {
            updatedOrders = [...orders];
            updatedOrders.splice(orderIndex, 1);
            setOrders(updatedOrders);
        }

        if (orderIndex === -1) {
            updatedOrders = [...orders, item];
            setOrders(updatedOrders);
        }

        // Calculate the total price
        const calculatedTotalPrice = updatedOrders.reduce(
            (total, order) => total + parseFloat(order.test_price),
            0
        );
        setTotalPrice(calculatedTotalPrice);
    };
    const handleClearFilter = () => {
        setSelectedCompanies([]);
        setSearchText("");
    };

    const handleCancelOrder = () => {
        setOrders([]);
        setCancelOrder(false);
    };
    const handleSubmitOrder = async () => {
        try {
            setIsLoading(true);
            await orderService.createOrders(patient.id, orders);
            setOrderSuccess(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };
    return (
        <>
            {patient && patient.id && (
                <>
                    <Container className={classes.container}>
                        <Typography
                            component="h5"
                            variant="h5"
                            className={classes.pageTitle}
                        >
                            New Order For
                            {` ${patient.firstname} ${patient.lastname}`}
                        </Typography>
                        <Stack spacing={2} mb={2} mt={1}>
                            <Breadcrumbs separator="›" aria-label="breadcrumb">
                                <Link
                                    underline="hover"
                                    key="1"
                                    color="inherit"
                                    href="/"
                                    onClick={handleClick}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    underline="hover"
                                    key="2"
                                    color="inherit"
                                    href="/dashboard"
                                    onClick={handleClick}
                                >
                                    {patient.firstname + " " + patient.lastname}
                                </Link>

                                <Typography key="3" color="text.primary">
                                    New Order
                                </Typography>
                            </Breadcrumbs>
                        </Stack>
                        <Grid container>
                            <Grid item xs={9}>
                                <Grid mb={2} className={classes.testsContainer}>
                                    <Typography variant="h6">
                                        Favorite Tests
                                    </Typography>
                                    <TestTable
                                        isLoading={isLoading}
                                        catalog={favoriteCatalog}
                                        handleFavorite={handleFavorite}
                                        handleShowDetails={(item) =>
                                            setSelectedItem(item)
                                        }
                                        selectedItem={selectedItem}
                                        handleAddOrder={handleAddOrder}
                                    />
                                </Grid>
                                <Grid className={classes.testsContainer}>
                                    <Grid className={classes.searchContainer}>
                                        <Typography variant="h6">
                                            All Tests
                                        </Typography>
                                        <Search
                                            placeholderText="Search "
                                            onFormSubmit={handleSearch}
                                            handleSearchClick={
                                                handleSearchClick
                                            }
                                            searchText={searchText}
                                            setSearchText={setSearchText}
                                        />
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <Button
                                                className={classes.filterButton}
                                                onClick={handleClearFilter}
                                            >
                                                Clear All Filters
                                            </Button>
                                            <LabCompanies
                                                catalogLabCompanies={
                                                    catalogLabCompanies
                                                }
                                                selectedCompanies={
                                                    selectedCompanies
                                                }
                                                onCheckBoxChangeHandler={
                                                    onCheckBoxChangeHandler
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TestTable
                                                isLoading={isLoading}
                                                catalog={catalog}
                                                handleFavorite={handleFavorite}
                                                handleShowDetails={(item) =>
                                                    setSelectedItem(item)
                                                }
                                                selectedItem={selectedItem}
                                                handleAddOrder={handleAddOrder}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <Orders
                                    orders={orders}
                                    totalPrice={totalPrice}
                                    setCancelOrder={setCancelOrder}
                                    handleAddOrder={handleAddOrder}
                                    handleSubmitOrder={handleSubmitOrder}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                    <CancelOrderModal
                        cancelOrder={cancelOrder}
                        setCancelOrder={setCancelOrder}
                        handleCancelOrder={handleCancelOrder}
                    />

                    <ModelBody
                        opened={orderSuccess}
                        closeModal={() => handleNext(StepEnum.DASHBOARD)}
                    >
                        <OrderSuccessModal handleNext={handleNext} />
                    </ModelBody>
                </>
            )}

            {!patient && openedModal === StepEnum.SEARCH && (
                <ModelBody
                    opened={openedModal === StepEnum.SEARCH}
                    closeModal={() => handleNext(StepEnum.DASHBOARD)}
                >
                    <SelectPatientModal
                        handleNext={handleNext}
                        onClose={() => handleNext(StepEnum.DASHBOARD)}
                    />
                </ModelBody>
            )}

            {!patient && openedModal === StepEnum.NEW_PATIENT && (
                <ModelBody
                    opened={openedModal === StepEnum.NEW_PATIENT}
                    closeModal={() => handleNext(StepEnum.SEARCH)}
                >
                    <NewPatientModal
                        handleNext={handleNext}
                        onClose={() => handleNext(StepEnum.SEARCH)}
                    />
                </ModelBody>
            )}
        </>
    );
};

export default Order;

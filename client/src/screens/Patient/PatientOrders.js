import React, { useCallback, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
    Box,
    Breadcrumbs,
    Button,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import OrderDetails from "../Order/components/OrderDetails";
import ModelBody from "../../components/common/ModelBody";
import EditPatientModal from "./components/EditPatientModal";
import useEffectOnce from "../../hooks/useEffectOnce";
import { API_BASE } from "../../utils/constants";
import axios from "axios";
import authHeader from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: theme.spacing(2) + "!important",
        width: "100%",
    },

    flex: {
        display: "flex",
        alignItems: "center",
    },
    editButton: {
        padding: theme.spacing(0) + "!important",
        textTransform: "none !important",
        marginLeft: theme.spacing(2) + "!important",
    },
    breadcrumbLink: {
        color: "inherit",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    breadcrumbs: {
        fontSize: "14px !important",
        "& p": {
            fontSize: "14px !important",
        },
    },
}));

async function getPatientRequest(patientId) {
    const res = await axios.get(`${API_BASE}/patient/${patientId}`, {
        headers: authHeader(),
    });
    return res.data;
}
async function getPatientOrdersRequest(patientId) {
    const res = await axios.get(`${API_BASE}/patient/${patientId}/orders`, {
        headers: authHeader(),
    });
    return res.data;
}
function PatientOrders() {
    const classes = useStyles();
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [editPatient, setEditPatient] = useState(false);
    const { patientId } = useParams();

    const handleEditButton = () => {
        setEditPatient(true);
    };

    const groupOrdersByOrderId = (data) => {
        const groupedOrders = new Map();

        data.forEach((order) => {
            const orderId = order.order_id;

            if (!groupedOrders.has(orderId)) {
                groupedOrders.set(orderId, [order]);
            } else {
                groupedOrders.get(orderId).push(order);
            }
        });

        return Array.from(groupedOrders.values());
    };

    const fetchPatientPageData = useCallback(async (patientId) => {
        setIsLoading(true);
        try {
            const patientResponse = await getPatientRequest(patientId);

            setPatient({ ...patientResponse.data, id: patientId });
            const ordersResponse = await getPatientOrdersRequest(patientId);

            const ordersData = groupOrdersByOrderId(ordersResponse.data);
            setOrders(ordersData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }, []);

    useEffectOnce(() => {
        patientId && fetchPatientPageData(patientId);
    }, []);

    const cancelOrder = (orderId) => {
        const updatedOrders = orders.map((orderGroup) => {
            return orderGroup.map((order) => {
                if (order.order_id === orderId) {
                    return {
                        ...order,
                        order_item_status: "Cancelled",
                        order_status: "Cancelled",
                    };
                }
                return order;
            });
        });

        setOrders(updatedOrders);
    };

    return (
        !isLoading &&
        patient && (
            <Container className={classes.container}>
                <Typography component="h5" variant="h5">
                    {`${patient.firstname} ${patient.lastname}`}
                </Typography>
                <Box className={classes.flex}>
                    <Typography variant="body2">{patient.email}</Typography>
                    <Button
                        variant="text"
                        className={classes.editButton}
                        onClick={handleEditButton}
                    >
                        Edit Patient
                    </Button>
                </Box>
                <Stack spacing={2} marginY={2}>
                    <Breadcrumbs
                        separator="›"
                        aria-label="breadcrumb"
                        className={classes.breadcrumbs}
                    >
                        <RouterLink
                            key="1"
                            to="/"
                            className={classes.breadcrumbLink}
                        >
                            Dashboard
                        </RouterLink>

                        <Typography key="2" color="text.primary">
                            {`${patient.firstname} ${patient.lastname}`}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
                {orders &&
                    orders.length > 0 &&
                    orders.map((order, idx) => (
                        <OrderDetails
                            key={idx}
                            patientId={patientId}
                            orderItems={order}
                            cancelOrder={cancelOrder}
                        />
                    ))}
                <ModelBody
                    opened={editPatient}
                    closeModal={() => setEditPatient(false)}
                >
                    <EditPatientModal
                        onClose={() => setEditPatient(false)}
                        patient={patient}
                        setPatient={setPatient}
                    />
                </ModelBody>
            </Container>
        )
    );
}

export default PatientOrders;

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
import patientService from "../../services/patient.service";

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
}));
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
        const groupedOrders = {};

        data.forEach((order) => {
            const orderId = order.order_id;

            if (!groupedOrders[orderId]) {
                groupedOrders[orderId] = [order];
            } else {
                groupedOrders[orderId].push(order);
            }
        });

        return Object.values(groupedOrders);
    };

    const fetchPatientPageData = useCallback(async (id) => {
        setIsLoading(true);
        try {
            const patientResponse = await patientService.getPatient(id);
            const ordersResponse = await patientService.getPatientOrders(id);
            setPatient(patientResponse.data);
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
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
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
                        firstName={patient.firstname}
                        lastName={patient.lastname}
                        email={patient.email}
                        patientId={patientId}
                    />
                </ModelBody>
            </Container>
        )
    );
}

export default PatientOrders;

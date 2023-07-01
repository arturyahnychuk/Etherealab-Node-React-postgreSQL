import React from "react";

import {
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    label: {
        fontWeight: "600",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    text: {
        marginLeft: theme.spacing(1),
    },
    closeButton: {
        borderColor: theme.palette.black + " !important",
        color: theme.palette.black + " !important",
    },
    title: {
        fontSize: "17px !important",
        fontWeight: 700 + "!important",
        color: "#546e7a",
    },
    tableRow: {
        "&:last-child td": {
            borderBottom: "none !important",
            padding: "0px !important",
        },
    },
}));

const DetailToolTip = ({ data, onClose }) => {
    const classes = useStyles();
    const {
        lab_company_name,
        lab_company_test_name,
        test_price,
        sample_type_name,
    } = data;

    return (
        <Box minWidth={400}>
            <Box className={classes.header} mb={1}>
                <div></div>
                <Typography component="h2" variant="" className={classes.title}>
                    Lab Company Test Detail
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => onClose()}
                    className={classes.closeButton}
                >
                    Close
                </Button>
            </Box>
            <hr />
            <Table>
                <TableBody>
                    <TableRow className={classes.tableRow}>
                        <TableCell className={classes.label}>
                            Lab Company:
                        </TableCell>
                        <TableCell className={classes.text}>
                            {lab_company_name}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.label}>
                            Test Name:
                        </TableCell>
                        <TableCell className={classes.text}>
                            {lab_company_test_name}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.label}>Sample:</TableCell>
                        <TableCell className={classes.text}>
                            {sample_type_name}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.label}>Price:</TableCell>
                        <TableCell className={classes.text}>
                            {test_price}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    );
};

export default DetailToolTip;

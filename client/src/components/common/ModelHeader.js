import React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    closeButton: {
        borderColor: theme.palette.black + " !important",
        color: theme.palette.black + " !important",
        padding: theme.spacing(0, 2) + " !important",
    },
    title: {
        fontSize: "16px !important",
        fontWeight: 600 + "!important",
        color: theme.Colors.black,
    },
}));

function ModelHeader(props) {
    const classes = useStyles();
    const { title, onClose } = props;
    return (
        <>
            <Box className={classes.header} mb={1}>
                <div></div>
                <Typography component="h2" variant="" className={classes.title}>
                    {title}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => onClose()}
                    className={classes.closeButton}
                >
                    Close
                </Button>
            </Box>
            <Divider />
        </>
    );
}

export default ModelHeader;

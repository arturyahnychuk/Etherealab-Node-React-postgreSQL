import React from "react";

import { Backdrop, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

// TODO:: Add local fetching indicator https://www.basefactor.com/react-how-to-display-a-loading-indicator-on-fetch-calls
const Dimmer = ({ isOpen }) => {
    const classes = useStyles();
    const handleClose = () => {};

    return (
        <Backdrop
            className={classes.backdrop}
            open={isOpen}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default Dimmer;

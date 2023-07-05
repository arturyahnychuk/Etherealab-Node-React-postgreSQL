import { Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 1, 4),
    },
}));

function ModelBody(props) {
    const classes = useStyles();
    const { opened, closeModal, children } = props;
    return (
        <Modal
            open={opened}
            onClose={closeModal}
            className={classes.modal}
            aria-labelledby="modal"
            aria-describedby="modal-content"
            disableAutoFocus
            disableEnforceFocus
        >
            <div className={classes.modalContent} role="tooltip">
                {children}
            </div>
        </Modal>
    );
}

export default ModelBody;

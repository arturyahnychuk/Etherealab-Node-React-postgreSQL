import React, { useState, useRef } from "react";
import { Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
    },
}));

const ModalPopup = (props) => {
    const { children, bodyElement } = props;
    const [openedModal, setOpenedModal] = useState(false);
    const modalAnchor = useRef(null);

    const openModal = () => {
        setOpenedModal(true);
    };

    const closeModal = () => {
        setOpenedModal(false);
    };

    const classes = useStyles();
    const bodyElementWithCloseModal = React.cloneElement(bodyElement, {
        onClose: closeModal,
    });

    return (
        <div>
            <span
                ref={modalAnchor}
                onClick={openModal}
                style={{ cursor: "pointer" }}
            >
                {children}
            </span>
            <Modal
                open={openedModal}
                onClose={closeModal}
                className={classes.modal}
                aria-labelledby="popup-modal"
                aria-describedby="popup-modal-content"
                disableAutoFocus
                disableEnforceFocus
            >
                <div className={classes.modalContent} role="tooltip">
                    {bodyElementWithCloseModal}
                </div>
            </Modal>
        </div>
    );
};

export default ModalPopup;

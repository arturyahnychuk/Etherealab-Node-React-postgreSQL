/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        titleContainer: {
            textAlign: "center",
            borderBottom: "1px solid #ddd",
            minHeight: 53,
        },
        closeButton: {
            position: "absolute",
            right: theme.spacing(1),
            top: theme.spacing(1),
            padding: theme.spacing(1),
        },
        content: {
            padding: "1rem 1.5rem",
            whiteSpace: "pre-line",
        },
        actionsContainer: {
            padding: "1rem 1.5rem",
            justifyContent: "space-between",
        },
        w100: {
            minWidth: 100,
        },
    })
);

export default function CustomizedDialogs(params) {
    const { title, body, isModalOpen, isModalClose } = params;
    const [open, setOpen] = React.useState(isModalOpen);
    const classes = useStyles();

    return (
        <div>
            <Dialog
                fullWidth
                maxWidth="md"
                onClose={isModalClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={isModalClose}
                    className={classes.titleContainer}
                >
                    {title}
                    <IconButton
                        aria-label="Close"
                        className={classes.closeButton}
                        onClick={isModalClose}
                    >
                        {/* <CloseIcon /> */}
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.content} dividers>
                    {body}
                </DialogContent>
            </Dialog>
        </div>
    );
}

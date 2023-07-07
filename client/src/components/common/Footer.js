import { Box, Container, Typography } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
    footer: {
        clear: "both",
        position: "relative",
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(5),
    },
}));

const CustomTypography = withStyles(() => ({
    root: {
        fontSize: "11px",
        lineHeight: "4px",
        letterSpacing: ".65px",
    },
}))(Typography);

export default function Footer() {
    const classes = useStyles();
    return (
        <Container
            component="footer"
            maxWidth={false}
            className={classes.footer}
        >
            <Box pt={2} pb={2}>
                <CustomTypography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                >
                    Copyright &copy; MyEasyLabs
                </CustomTypography>
            </Box>
        </Container>
    );
}

import React from "react";

import clsx from "clsx";
import Footer from "../../components/common/Footer";
import { makeStyles, useTheme } from "@mui/styles";
import { Container, useMediaQuery } from "@mui/material";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    shiftContent: {
        paddingLeft: 0,
    },
    content: {
        flex: 1,
    },
}));

const MainLayout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
        defaultMatches: true,
    });

    return (
        <div
            className={clsx({
                [classes.root]: true,
                [classes.shiftContent]: isDesktop,
            })}
        >
            <Container maxWidth="lg" className={classes.content}>
                {children}
            </Container>
            <Footer />
        </div>
    );
};

export default MainLayout;

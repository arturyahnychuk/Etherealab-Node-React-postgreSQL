import React, { useState } from "react";

import clsx from "clsx";

import { /* Header, */ Footer, Sidebar } from "./components";
import { makeStyles } from "@mui/styles";
import { Container, useMediaQuery, useTheme } from "@mui/material";

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
    const [openSidebar, setOpenSidebar] = useState(false);

    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
        defaultMatches: true,
    });

    // const handleSidebarOpen = () => {
    //   setOpenSidebar(true);
    // };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    return (
        <div
            className={clsx({
                [classes.root]: true,
                [classes.shiftContent]: isDesktop,
            })}
        >
            {/* Removed as per CLIN-155 */}
            {/* <Header onSidebarOpen={handleSidebarOpen} /> */}
            <Sidebar
                onClose={handleSidebarClose}
                open={openSidebar}
                variant="temporary"
            />
            <Container maxWidth="lg" className={classes.content}>
                {children}
            </Container>
            <Footer />
        </div>
    );
};

export default MainLayout;

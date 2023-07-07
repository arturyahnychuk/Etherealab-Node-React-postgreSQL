import React, { useEffect, useState } from "react";

import clsx from "clsx";
import PropTypes from "prop-types";

import { Sidebar } from "./components";
import { makeStyles, useTheme } from "@mui/styles";
import { Container, useMediaQuery } from "@mui/material";
import Footer from "../../components/common/Footer";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        height: "100%",
        [theme.breakpoints.up("sm")]: {
            paddingTop: 50,
        },
    },
    shiftContent: {
        paddingLeft: "240px",
    },
    content: {
        flex: 1,
        margin: "0px !important",
    },
}));

const Dashboard = (props) => {
    const { children } = props;

    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
        defaultMatches: true,
    });
    const [openSidebar, setOpenSidebar] = useState(true);

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [children]);

    return (
        <div
            className={clsx({
                [classes.root]: true,
                [classes.shiftContent]: isDesktop,
            })}
        >
            <Sidebar
                onClose={handleSidebarClose}
                open={openSidebar}
                variant={"persistent"}
            />

            <Container maxWidth="xl" className={classes.content}>
                {children}
            </Container>
            <Footer />
        </div>
    );
};

Dashboard.defaultProps = {
    children: null,
};

Dashboard.propTypes = {
    children: PropTypes.node,
};

export default Dashboard;

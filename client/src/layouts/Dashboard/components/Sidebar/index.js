import React from "react";

import clsx from "clsx";
import PropTypes from "prop-types";

import useAuth from "../../../../hooks/useAuth";
import { client_pages } from "../../../../static/nav-pages";
import { getAllowedRoutes } from "../../../../utils/helpers";
import { SidebarNav } from "./components";
import { makeStyles } from "@mui/styles";
import { Drawer } from "@mui/material";
import Logo from "../../../../assets/img/logo.svg";

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 240,
        // display: "flex",
        [theme.breakpoints.up("lg")]: {
            height: "calc(100% - 64px)",
        },
        alignItems: "center",
        display: "flex",
    },
    root: {
        backgroundColor: theme.Colors.black,
        // flexDirection: "column",
        display: "block",
        textAlign: "center",
        width: "100%",
        height: "100%",
        padding: 0,
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    nav: {
        marginBottom: theme.spacing(2),
    },
    Logo: {
        width: "100%",
        backgroundColor: theme.Colors.black,
        objectFit: "cover",
        padding: theme.spacing(4),
    },
}));

const Sidebar = (props) => {
    const { open, variant, onClose, className, ...rest } = props;
    const classes = useStyles();
    const { user } = useAuth();
    const navPages = client_pages;
    const allowedPages = getAllowedRoutes(
        navPages,
        user && user.permissions ? user.permissions : []
    );
    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}
        >
            {/* <LogoIcon height={50} color="#333" /> */}
            <img src={Logo} alt="Logo" className={classes.Logo} />
            <div {...rest} className={clsx(classes.root, className)}>
                <SidebarNav className={classes.nav} pages={allowedPages} />
            </div>
        </Drawer>
    );
};

Sidebar.defaultProps = {
    className: null,
    onClose: () => {},
};

Sidebar.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
};

export default Sidebar;

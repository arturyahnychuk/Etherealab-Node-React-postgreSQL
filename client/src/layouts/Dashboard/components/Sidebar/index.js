import React from "react";

import clsx from "clsx";
import PropTypes from "prop-types";
import { client_pages } from "../../../../static/nav-pages";
import { SidebarNav } from "./components";
import { makeStyles } from "@mui/styles";
import { Drawer } from "@mui/material";
import Logo from "../../../../assets/img/logo-portal.svg";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 240,
        [theme.breakpoints.up("lg")]: {
            height: "100%",
        },
        alignItems: "center",
        display: "flex",
        backgroundColor: theme.Colors.black + "!important",
    },
    root: {
        backgroundColor: theme.Colors.black,
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
    link: {
        margin: theme.spacing(0),
        padding: theme.spacing(0),
    },
}));

const Sidebar = (props) => {
    const { open, variant, onClose, className, ...rest } = props;
    const classes = useStyles();
    const navPages = client_pages;

    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}
        >
            <RouterLink to="/dashboard" className={classes.link}>
                <img src={Logo} alt="Logo" className={classes.Logo} />
            </RouterLink>
            <div {...rest} className={clsx(classes.root, className)}>
                <SidebarNav className={classes.nav} pages={navPages} />
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

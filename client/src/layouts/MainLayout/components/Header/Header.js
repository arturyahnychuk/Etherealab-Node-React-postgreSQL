import React from "react";

import { Link as RouterLink, useHistory } from "react-router-dom";

import Logo from "../../../../assets/img/logo.svg";
import useAuth from "../../../../hooks/useAuth";
import { makeStyles } from "@mui/styles";
import { grey, orange } from "@mui/material/colors";
import { AppBar, Hidden, IconButton, Toolbar } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: "#ffffff",
        "& button": {
            color: orange[800],
            backgroundColor: grey[200],
        },
    },
    toolbar: {
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    Logo: {
        maxWidth: "180px",
    },
    navItems: {
        listStyle: "none",
        textDecoration: "none",
        "& a": {
            textDecoration: "none",
            color: "#1d1d1d",
        },
    },
    link: {
        marginRight: theme.spacing(2),
        textDecoration: "none",
        fontSize: "16px",
    },
    signOutButton: {
        marginLeft: theme.spacing(1),
    },
}));

const Header = ({ ...props }) => {
    const classes = useStyles();
    const history = useHistory();
    const { isAuthenticated, user, logout } = useAuth();
    const { onSidebarOpen } = props;

    const handleLogout = async () => {
        try {
            await logout();
            history.push(user.login_url || "/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            className={classes.appBar}
        >
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/">
                    <img src={Logo} alt="Logo" className={classes.Logo} />
                </RouterLink>
                <Hidden mdDown>
                    <div className={classes.navItems}>
                        {isAuthenticated && (
                            <>
                                <IconButton
                                    className={classes.signOutButton}
                                    color="inherit"
                                    onClick={() => handleLogout()}
                                >
                                    {/* <InputIcon /> */}
                                </IconButton>
                            </>
                        )}
                    </div>
                </Hidden>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onSidebarOpen}>
                        {/* <MenuIcon /> */}
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

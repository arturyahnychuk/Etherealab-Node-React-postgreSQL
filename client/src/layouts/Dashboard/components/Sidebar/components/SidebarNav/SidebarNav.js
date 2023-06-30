import React from "react";

import clsx from "clsx";
import PropTypes from "prop-types";
import { NavLink as RouterLink, matchPath, useHistory } from "react-router-dom";

import useAuth from "../../../../../../hooks/useAuth";
import NavItem from "./NavItem";
import { makeStyles } from "@mui/styles";
import { Button, List, ListItem } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    root: {
        "& hr": {
            display: "none",
        },
        "& ul": {
            padding: 0,
        },
        "& li": {
            margin: 0,
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        marginLeft: theme.spacing(4) + "!important",
    },
    item: {
        display: "flex",
        paddingTop: 0,
        paddingBottom: 0,
    },
    link: {
        display: "flex !important",
        alignItems: "center",
        justifyContent: "center",
    },
    linkTitle: {
        paddingLeft: theme.spacing(1),
        fontWeight: 700,
    },
    button: {
        color: "#fff",
        padding: "10px 0px",
        justifyContent: "flex-start",
        textTransform: "none",
        letterSpacing: 0,
        width: "100%",
        fontWeight: theme.typography.fontWeightMedium,
        "& span": {
            display: "block",
        },
        "& a": {
            color: theme.palette.white,
            display: "block",
            width: "100%",
            textDecoration: "none",
            textAlign: "center",
            textTransform: "capitalize",
            fontWeight: theme.typography.fontWeightMedium,
        },
    },
    icon: {
        color: theme.palette.icon,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        marginRight: theme.spacing(1),
    },
    active: {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        "& $icon": {
            color: theme.palette.primary.main,
        },
    },
}));

function renderNavItems({ items, pathname, depth = 0 }) {
    return (
        <List disablePadding>
            {items.reduce(
                // eslint-disable-next-line no-use-before-define
                (acc, item) =>
                    reduceChildRoutes({
                        acc,
                        item,
                        pathname,
                        depth,
                    }),
                []
            )}
        </List>
    );
}

function reduceChildRoutes({ acc, pathname, item, depth }) {
    const key = item.title + depth;

    if (item.items) {
        const open = matchPath(pathname, {
            path: item.href,
            exact: false,
        });

        acc.push(
            <NavItem
                depth={depth}
                icon={item.icon}
                info={item.info}
                key={key}
                open={Boolean(open)}
                title={item.title}
            >
                {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items,
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem
                depth={depth}
                href={item.href}
                icon={item.icon}
                info={item.info}
                key={key}
                title={item.title}
            />
        );
    }

    return acc;
}

const SidebarNav = (props) => {
    const { pages, className, ...rest } = props;

    const classes = useStyles();
    const history = useHistory();
    const { user, logout } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
            history.push(user.login_url || "/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <List {...rest} className={clsx(classes.root, className)}>
            {pages &&
                pages.map((page) => (
                    <List key={page.href}>
                        <ListItem
                            className={clsx(classes.item, className)}
                            disableGutters
                            key={page.href}
                        >
                            <Button className={classes.button}>
                                <RouterLink
                                    to={page.href}
                                    className={classes.link}
                                    onClick={page.logout && handleLogout}
                                >
                                    {page.icon}
                                    <span className={classes.linkTitle}>
                                        {page.title}
                                    </span>
                                </RouterLink>
                            </Button>
                        </ListItem>
                    </List>
                ))}
        </List>
    );
};

SidebarNav.defaultProps = {
    className: null,
};

SidebarNav.propTypes = {
    className: PropTypes.string,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            href: PropTypes.string,
            icon: PropTypes.node,
        })
    ).isRequired,
};

export default SidebarNav;

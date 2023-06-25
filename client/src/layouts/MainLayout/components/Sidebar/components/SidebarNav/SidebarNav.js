import React, { forwardRef } from "react";

import clsx from "clsx";
import { NavLink as RouterLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { blueGrey } from "@mui/material/colors";
import { Button, List, ListItem } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    root: {},
    item: {
        display: "flex",
        paddingTop: 0,
        paddingBottom: 0,
    },
    button: {
        color: blueGrey[800],
        padding: "10px 8px",
        justifyContent: "flex-start",
        textTransform: "none",
        letterSpacing: 0,
        width: "100%",
        fontWeight: theme.typography.fontWeightMedium,
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

const CustomRouterLink = forwardRef((props, ref) => (
    <div ref={ref} style={{ flexGrow: 1 }}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <RouterLink {...props} />
    </div>
));

const SidebarNav = (props) => {
    const { pages, className, ...rest } = props;

    const classes = useStyles();

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <List {...rest} className={clsx(classes.root, className)}>
            {pages.map((page) => (
                <ListItem
                    className={classes.item}
                    disableGutters
                    key={page.title}
                >
                    <Button
                        activeClassName={classes.active}
                        className={classes.button}
                        component={CustomRouterLink}
                        to={page.href}
                    >
                        <div className={classes.icon}>{page.icon}</div>
                        {page.title}
                    </Button>
                </ListItem>
            ))}
        </List>
    );
};

export default SidebarNav;

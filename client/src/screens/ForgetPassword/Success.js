import React from "react";

import { makeStyles } from "@mui/styles";
import { Card, CardContent, Link } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
        textAlign: "center",
        fontSize: "15px",
        lineHeight: "24px",
    },
}));

const Success = ({ header, loginText }) => {
    const classes = useStyles();
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <p>
                    {header} <Link href="/login_client">{loginText}</Link>
                </p>
            </CardContent>
        </Card>
    );
};

export default Success;

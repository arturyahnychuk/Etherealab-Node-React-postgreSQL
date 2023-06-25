import React from "react";

import { Card, CardContent, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
        textAlign: "center",
        "& p": {
            fontSize: "16px",
            lineHeight: "24px",
        },
    },
}));

const VerificationSuccess = ({ isEmailVerified }) => {
    const classes = useStyles();
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                {isEmailVerified ? (
                    <p>
                        Your can login here:{" "}
                        <Link
                            href={`${process.env.REACT_APP_SITE_URL}login_client`}
                        >
                            {`${process.env.REACT_APP_SITE_URL}login_client`}
                        </Link>
                    </p>
                ) : (
                    <>
                        <p>Thank you for confirming your email address. </p>
                        <p>
                            Your login page is{" "}
                            <Link
                                href={`${process.env.REACT_APP_SITE_URL}login_client`}
                            >
                                {`${process.env.REACT_APP_SITE_URL}login_client`}
                            </Link>
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default VerificationSuccess;

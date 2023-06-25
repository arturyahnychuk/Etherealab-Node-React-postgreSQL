import { Alert } from "@mui/material";
import React from "react";

const Error = ({ errors, variant, children }) => (
    <>
        {errors &&
            errors.map((error, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Alert severity="error" variant={variant} key={index}>
                    {error.msg}
                    {children}
                </Alert>
            ))}
    </>
);

Error.defaultProps = {
    errors: null,
    children: null,
    variant: "outlined",
};

export default Error;

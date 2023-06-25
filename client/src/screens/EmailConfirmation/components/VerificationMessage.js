import React from "react";

import { Alert } from "@mui/material";

const VerificationMessage = ({ severity, message }) => (
    <Alert severity={severity}>{message}</Alert>
);

export default VerificationMessage;

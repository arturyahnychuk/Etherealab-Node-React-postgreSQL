import React from "react";

import { Redirect } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const GuestGuard = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        switch (user.role) {
            case "PATIENT":
                return <Redirect to="/patient" />;
            case "CORPORATE":
                return <Redirect to="/corporate" />;
            default:
                return <Redirect to="/dashboard" />;
        }
    }

    return <>{children}</>;
};

export default GuestGuard;

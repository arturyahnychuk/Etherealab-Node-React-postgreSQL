import React from "react";

import { Redirect } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const AuthGuard = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Redirect to={(user && user.login_url) || "/login"} />;
    }

    return <>{children}</>;
};

export default AuthGuard;

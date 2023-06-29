import React from "react";

import { Redirect } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const Home = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }
    return <Redirect to="/login" />;
};

export default Home;

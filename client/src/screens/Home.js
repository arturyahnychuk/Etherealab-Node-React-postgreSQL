import React from "react";

import { Redirect } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { Autocomplete, Container, TextField } from "@mui/material";

const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
];
const Home = () => {
    const { isAuthenticated } = useAuth();

    // TODO: This might be changed as per requirements
    if (isAuthenticated) {
        return <Redirect to="/login_client" />;
    }
    return (
        <div>
            <Container>
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={top100Films.map((option) => option.title)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search input"
                            InputProps={{
                                ...params.InputProps,
                                type: "search",
                            }}
                        />
                    )}
                />
            </Container>
        </div>
    );
};

export default Home;

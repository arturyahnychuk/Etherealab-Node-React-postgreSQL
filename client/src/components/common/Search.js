import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchOutlined";

function Search(props) {
    const {
        onFormSubmit,
        handleSearchClick,
        searchText,
        setSearchText,
        placeholderText,
    } = props;
    return (
        <form onSubmit={onFormSubmit}>
            <TextField
                autoFocus
                fullWidth
                size="small"
                variant="outlined"
                placeholder={placeholderText}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton
                                size="small"
                                aria-label="search"
                                onSubmit={handleSearchClick}
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </form>
    );
}

export default Search;

import React from "react";

import Error from "./Error";
import { TextField } from "@mui/material";

const TextFieldWithError = ({
    autoFocus,
    fieldName,
    label,
    value,
    handleOnChange,
    handleOnBlur,
    errors,
    type,
    id,
}) => (
    <>
        <TextField
            value={value}
            variant="outlined"
            margin="dense"
            autoFocus={autoFocus || false}
            fullWidth
            id={id || fieldName}
            label={label}
            name={fieldName}
            type={type || "text"}
            autoComplete={fieldName}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
        />
        <Error errors={errors} />
    </>
);

export default TextFieldWithError;

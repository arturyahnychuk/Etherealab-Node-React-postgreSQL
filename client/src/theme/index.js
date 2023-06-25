// import overrides from "./overrides";
import { createTheme } from "@mui/material";
import palette from "./palette";
import typography from "./typography";
import Colors from "./color";

const theme = createTheme({
    Colors,
    palette,
    typography,
    zIndex: {
        appBar: 1200,
        drawer: 1100,
    },
});

export default theme;

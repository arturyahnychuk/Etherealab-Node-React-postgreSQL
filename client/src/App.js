import theme from "./theme";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";

function App() {
    return <ThemeProvider theme={theme}></ThemeProvider>;
}

export default App;

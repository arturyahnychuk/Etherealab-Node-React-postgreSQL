import theme from "./theme";
import { SnackbarProvider } from "notistack";

function App() {
    return <ThemeProvider theme={theme}></ThemeProvider>;
}

export default App;

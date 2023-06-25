import theme from "./theme";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/styles";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { AuthProvider } from "./contexts/AuthContext";
import Notifier from "./Notifier";
import HocRoutes from "./HocRoutes";

const history = createBrowserHistory();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider
                dense
                maxSnack={3}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Notifier />
                <Router history={history}>
                    <AuthProvider>
                        <HocRoutes />
                    </AuthProvider>
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;

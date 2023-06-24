import { Routes } from "react-router-dom";
import GuestGuard from "./components/GuestGuard";
import Login from "./screens/Auth/Login";
import SignUp from "./screens/Auth/SignUp";

export const renderRoutes = (routes = []) => (
    <Routes>
        {routes.map((route, i) => {
            const Guard = route.guard || Fragment;
            const Layout = route.layout || Fragment;
            const Component = route.component;

            return (
                <Route
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    path={route.path}
                    exact={route.exact}
                    render={(props) => (
                        <Guard>
                            <Layout>
                                <Component {...props} />
                            </Layout>
                        </Guard>
                    )}
                />
            );
        })}
    </Routes>
);

const routes = [
    { exact: true, path: "/login", guard: GuestGuard, component: Login },
    { exact: true, path: "/signup", guard: GuestGuard, component: SignUp },
];

export default routes;

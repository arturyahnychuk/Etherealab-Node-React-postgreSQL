import { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import GuestGuard from "./components/GuestGuard";
import Login from "./screens/Auth/Login";
import SignUp from "./screens/Auth/SignUp";
import MainLayout from "./layouts/MainLayout/MainLayout";
import ForgetPassword from "./screens/ForgetPassword";
import ResetPassword from "./screens/ResetPassword";
import Home from "./screens/Home";

export const renderRoutes = (routes = []) => (
    <Switch>
        {routes.map((route, i) => {
            const Guard = route.guard || Fragment;
            const Layout = route.layout || Fragment;
            const Component = route.component;

            return (
                <Route
                    key={i}
                    path={route.path}
                    exact={route.exact}
                    render={(props) => (
                        <Guard>
                            <Layout>
                                {route.routes ? (
                                    renderRoutes(route.routes)
                                ) : (
                                    <Component {...props} />
                                )}
                            </Layout>
                        </Guard>
                    )}
                />
            );
        })}
    </Switch>
);

const routes = [
    {
        exact: true,
        path: "/login_client",
        guard: GuestGuard,
        component: Login,
    },
    {
        exact: true,
        guard: GuestGuard,
        layout: MainLayout,
        path: "/forgot-password",
        component: ForgetPassword,
    },
    {
        exact: true,
        guard: GuestGuard,
        layout: MainLayout,
        path: "/password/reset/:userId/:token",
        component: ResetPassword,
    },
    {
        exact: true,
        guard: GuestGuard,
        layout: MainLayout,
        path: "/signup_client",
        component: SignUp,
    },
    {
        exact: true,
        // guard: ClientPortalGuard,
        // layout: DashboardLayout,
        path: "/dashboard",
        component: Home,
    },
    {
        path: "*",
        layout: MainLayout,
        routes: [
            {
                exact: true,
                path: "/",
                component: Home,
            },
        ],
    },
];

export default routes;

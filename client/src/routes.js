import { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import GuestGuard from "./components/GuestGuard";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import ForgetPassword from "./screens/ForgetPassword";
import ResetPassword from "./screens/ResetPassword";
import Home from "./screens/Home";
import DashboardLayout from "./layouts/Dashboard";
import ClientProfile from "./screens/ClientProfile/ClientProfile";
import Myself from "./screens/Myself";
import Patient from "./screens/Dashboard/Dashboard";
import Catalog from "./screens/Catalog";

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
        path: "/login",
        guard: GuestGuard,
        component: Login,
    },
    {
        exact: true,
        guard: GuestGuard,
        path: "/forgot-password",
        component: ForgetPassword,
    },
    {
        exact: true,
        guard: GuestGuard,
        path: "/password/reset/:userId/:token",
        component: ResetPassword,
    },
    {
        exact: true,
        guard: GuestGuard,
        path: "/signup",
        component: Signup,
    },
    {
        exact: true,
        layout: DashboardLayout,
        path: "/dashboard",
        component: Patient,
    },
    {
        exact: true,
        layout: DashboardLayout,
        path: "/myself",
        component: Myself,
    },
    {
        exact: true,
        layout: DashboardLayout,
        path: "/client-profile",
        component: ClientProfile,
    },
    {
        exact: true,
        layout: DashboardLayout,
        path: "/catalog",
        component: Catalog,
    },
    {
        path: "*",
        component: Home,
    },
];

export default routes;

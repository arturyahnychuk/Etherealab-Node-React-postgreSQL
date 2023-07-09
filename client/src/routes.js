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
import Dashboard from "./screens/Dashboard/Dashboard";
import Catalog from "./screens/Catalog";
import Order from "./screens/Order";
import PatientOrders from "./screens/Patient/PatientOrders";
import SelectPatient from "./screens/Patient/SelectPatient";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AuthGuard from "./components/AuthGuard";

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
        layout: MainLayout,
        component: Login,
    },
    {
        exact: true,
        guard: GuestGuard,
        path: "/forgot-password",
        layout: MainLayout,
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
        path: "/signup",
        component: Signup,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/dashboard",
        component: Dashboard,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/patient/:patientId/orders",
        component: PatientOrders,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/myself",
        component: Myself,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/client-profile",
        component: ClientProfile,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/catalog",
        component: Catalog,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/new-order",
        component: SelectPatient,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/patient/:patientId/new-order",
        component: Order,
    },
    {
        exact: true,
        guard: AuthGuard,
        layout: DashboardLayout,
        path: "/patient/:patientId/edit-order/:orderId",
        component: Order,
    },
    {
        path: "*",
        guard: AuthGuard,
        component: Home,
    },
];

export default routes;

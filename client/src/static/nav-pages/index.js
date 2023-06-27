import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
export const client_pages = [
    {
        id: 1,
        title: "Home",
        href: "/dashboard",
        icon: <HomeOutlinedIcon />,
    },
    {
        id: 2,
        icon: <AccountBoxOutlinedIcon />,
        title: "Myself",
        href: "/myself",
    },
    {
        id: 3,
        icon: <AdminPanelSettingsIcon />,
        title: "Client",
        href: "/client-profile",
    },
    {
        id: 6,
        icon: <ExitToAppOutlinedIcon />,
        title: "Logout",
        href: "/",
        logout: true,
    },
];

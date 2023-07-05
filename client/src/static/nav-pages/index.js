import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export const client_pages = [
    {
        id: 1,
        title: "Dashboard",
        href: "/dashboard",
        icon: <HomeIcon style={{ color: "#FFF", fontSize: "20px" }} />,
    },
    {
        id: 2,
        icon: <ListAltIcon style={{ color: "#FFF", fontSize: "20px" }} />,
        title: "Catalog",
        href: "/catalog",
    },
    {
        id: 3,
        icon: (
            <BookmarkBorderIcon style={{ color: "#FFF", fontSize: "20px" }} />
        ),
        title: "New Order",
        href: "/new-order",
    },
    {
        id: 4,
        icon: <PersonIcon style={{ color: "#FFF", fontSize: "20px" }} />,
        title: "Myself",
        href: "/myself",
    },
    {
        id: 5,
        icon: <LocationCityIcon style={{ color: "#FFF", fontSize: "20px" }} />,
        title: "Client",
        href: "/client-profile",
    },
    {
        id: 6,
        icon: <ExitToAppIcon style={{ color: "#FFF", fontSize: "20px" }} />,
        title: "Logout",
        href: "/",
        logout: true,
    },
];

import HomeIcon from '@mui/icons-material/Home';
export const client_pages = [
    {
        id: 1,
        title: "Dashboard",
        href: "/dashboard",
        icon: <HomeIcon style={{color:"#000",fontSize:"20px"}}/>,
    },
    {
        id: 2,
        icon: <HomeIcon style={{color:"#000",fontSize:"20px"}} />,
        title: "Myself",
        href: "/myself",
    },
    {
        id: 3,
        icon: <HomeIcon style={{color:"#000",fontSize:"20px"}} />,
        title: "Client",
        href: "/client-profile",
    },
    {
        id: 6,
        icon: <HomeIcon style={{color:"#000",fontSize:"20px"}} />,
        title: "Logout",
        href: "/",
        logout: true,
    },
];

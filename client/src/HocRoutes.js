import React from "react";
import routes, { renderRoutes } from "./routes";

const HocRoutes = () => {
    return <>{renderRoutes(routes || [])}</>;
};

export default HocRoutes;

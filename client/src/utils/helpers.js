import { intersection } from "lodash";

export const getAcronym = (str) => {
    if (!str || typeof str === "undefined" || str === "") {
        return "";
    }
    const matches = str.match(/\b(\w)/g);
    return matches.join("");
};

export const removeSpecialCharFromString = (str) =>
    str.replace(/[^a-zA-Z ]/g, "");

export function isArrayWithLength(arr) {
    return Array.isArray(arr) && arr.length;
}

export function getAllowedRoutes(routes, roles) {
    return routes.filter(({ permission }) => {
        if (!permission) return true;
        if (!isArrayWithLength(permission)) return true;
        return intersection(permission, roles).length;
    });
}

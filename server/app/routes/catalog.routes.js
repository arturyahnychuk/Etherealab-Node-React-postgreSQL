const express = require("express");
const Catalog = require("../controllers/catalog.controller");
const { authJwt } = require("../middlewares");

const router = express.Router();

router.post("/catalog/search", [authJwt.verifyToken], Catalog.searchCatalog);
router.get(
    "/catalog/lab-companies",
    [authJwt.verifyToken],
    Catalog.getLabCompanies
);
router.post(
    "/catalog/lab-company/favorite",
    [authJwt.verifyToken],
    Catalog.addFavorite
);
router.delete(
    "/catalog/lab-company/favorite/:id",
    [authJwt.verifyToken],
    Catalog.deleteFavorite
);
module.exports = router;

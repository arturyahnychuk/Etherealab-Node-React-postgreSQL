const express = require("express");
const { authJwt } = require("../middlewares");
const Client = require("../controllers/client.controller");
const router = express.Router();

router.get("/client/:id",[ authJwt.verifyToken], Client.getClientProfile)
router.put(
    "/client/profile/:id",
    [authJwt.verifyToken],
    Client.updateClientProfile
);

module.exports = router;

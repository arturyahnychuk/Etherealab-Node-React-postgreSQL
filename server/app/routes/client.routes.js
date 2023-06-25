const express = require("express");
const { authJwt } = require("../middlewares");
const Client = require("../controllers/client.controller");
const router = express.Router();

router.put(
    "/client/profile/:id",
    [authJwt.verifyToken, authorization.isReadOnly],
    Client.updateClientProfile
);

module.exports = router;

const express = require("express");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/myself.controller");

const router = express.Router();

router.get(
    "/myself/profile/:userId",
    [authJwt.verifyToken],
    controller.getProfile
);
router.put("/myself/profile/", [authJwt.verifyToken], controller.updateProfile);
module.exports = router;

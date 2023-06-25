const express = require("express");
const { authJwt } = require("../middlewares");
const IndexController = require("../controllers/index.controller");

const router = express.Router();

router.get("/auth/user", [authJwt.verifyToken], IndexController.getUser);
router.get("/auth/client", [authJwt.verifyToken], IndexController.getClient);

module.exports = router;

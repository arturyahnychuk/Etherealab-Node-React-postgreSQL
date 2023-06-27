const express = require("express");
const controller = require("../controllers/login.controller");

const router = express.Router();

router.post("/auth/login", controller.signin);

module.exports = router;

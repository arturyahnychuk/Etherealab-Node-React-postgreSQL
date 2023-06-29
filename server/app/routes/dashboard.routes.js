const express = require("express");
const { authJwt } = require("../middlewares");
const Dashboard = require("../controllers/dashboard.controller.js");

const router = express.Router();

router.post("/client/patient-search", [authJwt.verifyToken], Dashboard.search);

module.exports = router;

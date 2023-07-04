const express = require("express");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/order.controller");

const router = express.Router();

router.post(
    "/order/:patient_id/create-order",
    [authJwt.verifyToken],
    controller.createOrder
);
module.exports = router;

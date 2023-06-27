const express = require("express");
const controller = require("../controllers/signup.controller");

const router = express.Router();

router.post("/auth/signup", controller.signup);
router.post("/auth/field/validate", controller.fieldValidate);

module.exports = router;

const express = require("express");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/patient.controller");

const router = express.Router();

router.post(
    "/patient/create-patient",
    [authJwt.verifyToken],
    controller.createPatient
);

router.post(
    "/patient/search",
    [authJwt.verifyToken],
    controller.searchPatientsByClientId
);

router.post(
    "/patient/email/validate",
    [authJwt.verifyToken],
    controller.validateEmail
);

module.exports = router;

const express = require("express");
const controller = require("../controllers/auth-email.controller");

const router = express.Router();

// verify confirmation
router.get("/email/confirmation/:userId/:token", controller.verifyConfirmation);

// Send Signup confirmation email
router.post("/email/send/verification", controller.sendSignupConfirmationEmail);

// Resend Signup confirmation email
router.post(
    "/email/resend/verification",
    controller.resendSignupConfirmationEmail
);

module.exports = router;

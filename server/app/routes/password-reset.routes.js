const express = require("express");
const controller = require("../controllers/password-reset.controller");

const router = express.Router();

// Reset password email
router.post(
    "/auth/reset_password/user/:email",
    controller.sendPasswordResetEmail
);

// Forget password reset
router.post("/auth/reset/:userId/:token", controller.receiveNewPassword);

module.exports = router;

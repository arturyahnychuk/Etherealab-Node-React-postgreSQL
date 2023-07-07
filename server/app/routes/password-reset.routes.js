const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");

const db = require("../db");
const config = require("../../config");
const { errorMessage, successMessage, status } = require("../helpers/status");

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let mailConfig;
if (process.env.NODE_ENV === "production") {
    mailConfig = {
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
            user: "real.user",
            pass: "verysecret",
        },
    };
} else {
    mailConfig = {
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: config.emailConfig.user,
            pass: config.emailConfig.pass,
        },
    };
}

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(mailConfig);

const getPasswordResetURL = (user, token) => {
    return `${process.env.CLIENT_URL}/password/reset/${user.id}/${token}`;
};

const resetPasswordTemplate = (user, url) => {
    const from = process.env.EMAIL_LOGIN;
    const to = user.email;
    const subject = "Password Reset";
    const html = `
  <p>Hi ${user.firstname || user.email},</p>
  <p>You can use the following link to reset your password.  It will expire in one hour.</p>
  <a href=${url}>${url}</a>
  `;

    return { from, to, subject, html };
};

const usePasswordHashToMakeToken = (user) => {
    const passwordHash = user.password;
    const userId = user.id;
    const secret = `${passwordHash}-${user.created}`;
    const token = jwt.sign({ userId }, secret, {
        expiresIn: 3600, // 1 hour
    });
    return token;
};

const sendRecoveryEmail = async (user, res) => {
    const accessToken = usePasswordHashToMakeToken(user);
    const url = getPasswordResetURL(user, accessToken);
    const emailTemplate = resetPasswordTemplate(user, url);

    if (process.env.NODE_ENV === "development") {
        try {
            const info = await transporter.sendMail(emailTemplate);
            console.info("Sending email:", info);
            successMessage.message =
                "If the email address exists then an email will be sent with password reset instructions.";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while sending a reset email.",
            });
        }
    }
    sgMail.send(emailTemplate).then(
        (info) => {
            return res.status(200).json({
                status: "success",
                message:
                    "If the email address exists then an email will be sent with password reset instructions.",
            });
        },
        (error) => {
            if (error.response) {
                console.error("error.response.body:", error.response.body);
            }
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while sending a reset email.",
            });
        }
    );
};
// Reset password email
router.post("/auth/reset_password/user/:email", async (req, res) => {
    const { email } = req.params;
    const userQueryResponse = await db.query(
        "select id, email, firstname, password, created from users where email = $1 limit 1",
        [email]
    );
    if (userQueryResponse.rows.length < 1) {
        errorMessage.message =
            "We couldn't find any record with that email address.";
        return res.status(status.notfound).send(errorMessage);
    }

    const user = userQueryResponse.rows[0];
    if (!user) {
        errorMessage.message = "User not found";
        errorMessage.user = user;
        return res.status(status.notfound).send(errorMessage);
    }

    if (user) {
        const token = usePasswordHashToMakeToken(user);
        const token_expires = moment()
            .add(1, "hours")
            .format("YYYY-MM-DD HH:mm:ss"); // 1 hour

        const userUpdateResponse = await db.query(
            `update users set reset_password_token=$1, reset_password_expires= $2, updated= now() where id =$3`,
            [token, token_expires, user.id]
        );

        if (userUpdateResponse.rowCount) {
            sendRecoveryEmail(user, res);
        }
    }
});

// Forget password reset
router.post("/auth/reset/:userId/:token", async (req, res) => {
    const { userId, token } = req.params;
    const { password } = req.body;

    try {
        const now = moment().format("YYYY-MM-DD HH:mm:ss");
        const queryUserResponse = await db.query(
            `select id, email, reset_password_token, reset_password_expires from users where id=$1 and reset_password_token=$2 and reset_password_expires > $3`,
            [userId, token, now]
        );
        const user = queryUserResponse.rows[0];

        if (!user) {
            errorMessage.message = "User not found";
            errorMessage.user = user;
            return res.status(status.notfound).send(errorMessage);
        }

        const hashedPassword = bcrypt.hashSync(password, 8);

        const updateUserResponse = await db.query(
            `update users set password=$1, reset_password_token=NULL, reset_password_expires=NULL, updated= now() where id =$2 `,
            [hashedPassword, user.id]
        );

        if (updateUserResponse.rowCount) {
            successMessage.message = "Password changed successfully!";
            return res.status(status.success).send(successMessage);
        }
    } catch (error) {
        errorMessage.message = "Password change not successful";
        return res.status(status.error).send(errorMessage);
    }
});

module.exports = {
    router,
    transporter,
    sgMail,
};

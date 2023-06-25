const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");
const db = require("../db");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { errorMessage, successMessage, status } = require("../helpers/status");
const {
    transporter,
    getPasswordResetURL,
    resetPasswordTemplate,
} = require("../helpers/email");
/**
 * `secret` is passwordHash concatenated with user's created,
 * so if someones gets a user token they still need a timestamp to intercept.
 * @param {object} user
 * @returns {string} token
 */
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
                "We have sent an email with instructions to reset your credentials.";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while sending a reset email.",
            });
        }
    }
    sgMail.send(emailTemplate).then(
        (info) => {
            console.log(`** Email sent **`, info);
            return res.status(200).json({
                status: "success",
                message:
                    "We have sent an email with instructions to reset your credentials.",
            });
        },
        (error) => {
            console.error(error);
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

exports.sendPasswordResetEmail = async (req, res) => {
    // Check where user already signed up or not
    const { email } = req.params;
    const userQueryResponse = await db.query(
        "SELECT id, client_id, firstname, lastname, email, password, sign_dt, email_confirm_dt, created FROM users WHERE email = $1 LIMIT 1",
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
    const clientQueryResponse = await db.query(
        "SELECT id, name FROM client WHERE id = $1",
        [user.client_id]
    );

    if (!user.sign_dt) {
        errorMessage.message =
            "The password for this additional user can not be reset until user registration has first been completed.";
        delete user.password; // delete password from response
        user.client = clientQueryResponse.rows[0];
        errorMessage.user = user;
        return res.status(status.unauthorized).send(errorMessage);
    }

    if (!user.email_confirm_dt) {
        errorMessage.message =
            "Login can not be done until the email address is confirmed. Please see the request in your email inbox.";
        delete user.password; // delete password from response
        errorMessage.user = user;
        return res.status(status.unauthorized).send(errorMessage);
    }

    if (user) {
        const token = usePasswordHashToMakeToken(user);
        const token_expires = moment()
            .add(1, "hours")
            .format("YYYY-MM-DD HH:mm:ss"); // 1 hour

        // update user table for password reset token and expires time
        const userUpdateResponse = await db.query(
            `UPDATE users SET reset_password_token='${token}', reset_password_expires='${token_expires}', updated= now() WHERE id =${user.id}`
        );

        if (userUpdateResponse.rowCount) {
            sendRecoveryEmail(user, res);
        }
    }
};

exports.receiveNewPassword = async (req, res) => {
    const { userId, token } = req.params;
    const { password } = req.body;

    // find user with reset_password_token AND userId
    // check token expires validity
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const queryUserResponse = await db.query(
        `SELECT id, email, reset_password_token, reset_password_expires FROM users 
    WHERE id=$1 AND reset_password_token=$2 AND reset_password_expires > '${now}'`,
        [userId, token]
    );
    const user = queryUserResponse.rows[0];

    if (!user) {
        errorMessage.message = "User not found";
        errorMessage.user = user;
        return res.status(status.notfound).send(errorMessage);
    }

    // if all set then accept new password
    const hashedPassword = bcrypt.hashSync(password, 8);

    const updateUserResponse = await db.query(
        `UPDATE users SET password=$1, reset_password_token=NULL, reset_password_expires=NULL, updated= now() 
    WHERE id =$2 `,
        [hashedPassword, user.id]
    );

    if (updateUserResponse.rowCount) {
        successMessage.message = "Password changed succesfullly!";
        return res.status(status.success).send(successMessage);
    }
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
const db = require("../db");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { errorMessage, successMessage, status } = require("../helpers/status");
const {
    transporter,
    getPasswordResetURL,
    resetPasswordTemplate,
} = require("../helpers/email");

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
                    "We have sent an email with instructions to reset your credentials.",
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

exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.params;
    const userQueryResponse = await db.query(
        "select id, client_id, firstname, lastname, email, password, created from users where email = $1 limit 1",
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

        // update user table for password reset token and expires time
        const userUpdateResponse = await db.query(
            `update users set reset_password_token='${token}', reset_password_expires='${token_expires}', updated= now() where id =${user.id}`
        );

        if (userUpdateResponse.rowCount) {
            sendRecoveryEmail(user, res);
        }
    }
};

exports.receiveNewPassword = async (req, res) => {
    const { userId, token } = req.params;
    const { password } = req.body;

    try {
        const now = moment().format("YYYY-MM-DD HH:mm:ss");
        const queryUserResponse = await db.query(
            `select id, email, reset_password_token, reset_password_expires from users where id=$1 and reset_password_token=$2 and reset_password_expires > '${now}'`,
            [userId, token]
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
};

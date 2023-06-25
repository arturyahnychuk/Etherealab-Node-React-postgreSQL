const jwt = require("jsonwebtoken");
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
const db = require("../db");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { errorMessage, successMessage, status } = require("../helpers/status");
const {
    transporter,
    getEmailVerificationURL,
    signUpConfirmationTemplate,
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

exports.verifyConfirmation = async (req, res) => {
    try {
        // Check if user is already verified
        const userRows = await db.query(
            "SELECT id, token, email_confirm_dt FROM users WHERE id = $1",
            [req.params.userId]
        );

        const user = userRows.rows[0];
        if (user) {
            // TODO:: Check if user provided valid token or not
            // Check if user is already confirmed his/her email
            if (user.email_confirm_dt && !user.token) {
                successMessage.message = "User is already verified!";
                successMessage.data = user;
                return res.status(status.success).send(successMessage);
            }
            // update email_confirm_dt if it's null and remove token
            const now = moment().format("YYYY-MM-DD HH:mm:ss");
            await db.query(
                `UPDATE users SET email_confirm_dt='${now}', token=null, updated= now() WHERE id = $1`,
                [req.params.userId]
            );

            user.email_confirm_dt = now;
            successMessage.data = user;
            successMessage.message = "Email address successfully verified";
            return res.status(status.success).send(successMessage);
        }
        // Couldn't find the record
        errorMessage.message =
            "Couldn't find the record. Validation link might be broken. Check your email address";
        return res.status(status.notfound).send(errorMessage);
    } catch (error) {
        // handle the error
        errorMessage.message = error;
        return res.status(status.error).send(errorMessage);
    }
};

exports.sendSignupConfirmationEmail = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorMessage.message = errors.array();
        return res.status(status.error).send(errorMessage);
    }

    const usersQueryResponse = await db.query(
        "SELECT id, client_id, firstName, lastName, email, password, created FROM users WHERE email = $1",
        [req.body.email]
    );

    if (usersQueryResponse.rows.length < 1) {
        errorMessage.message =
            "We couldn't find any record with that email address.";
        return res.status(status.notfound).send(errorMessage);
    }

    const user = usersQueryResponse.rows[0];
    const accesstToken = usePasswordHashToMakeToken(user);
    const url = getEmailVerificationURL(user, accesstToken);
    const emailTemplate = signUpConfirmationTemplate(user, url);

    // update token field on that user table
    await db.query(`UPDATE users SET token=$1, updated= now() WHERE id =$2`, [
        accesstToken,
        user.id,
    ]);

    // send mail with defined transport object
    const info = await transporter.sendMail(emailTemplate);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    successMessage.message = ("Message sent: %s", info.messageId);
    return res.status(status.success).send(successMessage);
};

exports.resendSignupConfirmationEmail = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorMessage.message = errors.array();
        return res.status(status.error).send(errorMessage);
    }

    // Check where user already signed up or not
    const usersQueryResponse = await db.query(
        "SELECT id, email, firstname, lastname, token, email_confirm_dt, created FROM users WHERE id = $1",
        [req.body.id]
    );
    if (usersQueryResponse.rows.length < 1) {
        errorMessage.message =
            "We couldn't find any record with that email address.";
        return res.status(status.notfound).send(errorMessage);
    }

    const user = usersQueryResponse.rows[0];
    let accesstToken;
    if (user.token) {
        accesstToken = user.token;
    } else {
        accesstToken = usePasswordHashToMakeToken(user);
        // update token field on that user table
        await db.query(
            `UPDATE users SET token=$1, updated= now() WHERE id =$2`,
            [accesstToken, user.id]
        );
    }
    const url = getEmailVerificationURL(user, accesstToken);
    const emailTemplate = signUpConfirmationTemplate(user, url);
    // send mail with defined transport object
    const info = await transporter.sendMail(emailTemplate);
    if (info) {
        console.info("Email sent:", info);
    }

    successMessage.message =
        "We have email verification link on your email address!";
    return res.status(status.success).send(successMessage);
};

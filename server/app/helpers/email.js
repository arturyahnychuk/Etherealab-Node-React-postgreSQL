const nodemailer = require("nodemailer");
const config = require("../../config");

let mailConfig;
if (process.env.NODE_ENV === "production") {
    // all emails are delivered to destination
    mailConfig = {
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
            user: "real.user",
            pass: "verysecret",
        },
    };
} else {
    // all emails are catched by ethereal.email
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

const signUpConfirmationTemplate = (user, url) => {
    const from = process.env.EMAIL_LOGIN;
    const to = user.email;
    const subject = "Signup Confirmation";
    const html = `
  <p>Hi ${user.displayName || user.email},</p>
  <p>Thank you for signing up</p>
  <p>To confirm your email address click or copy the following link:</p>
  <a href=${url}>${url}</a>
  `;

    return { from, to, subject, html };
};

const getEmailVerificationURL = (user, token) =>
    `${process.env.CLIENT_URL}/email/confirmation/${user.id}/${token}`;

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

const email = {
    transporter, // for development only
    getEmailVerificationURL,
    getPasswordResetURL,
    resetPasswordTemplate,
    signUpConfirmationTemplate,
};

module.exports = email;

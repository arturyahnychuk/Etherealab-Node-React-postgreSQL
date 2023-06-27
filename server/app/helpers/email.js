const nodemailer = require("nodemailer");
const config = require("../../config");

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

const email = {
    transporter, // for development only
    getPasswordResetURL,
    resetPasswordTemplate,
};

module.exports = email;

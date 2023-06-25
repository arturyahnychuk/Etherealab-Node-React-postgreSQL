const dotenv = require("dotenv");

const envFilePath = `${process.cwd()}/.env.dev`;

dotenv.config({ debug: true, override: true, path: envFilePath });

module.exports = {
    port: process.env.PORT,
    dbConfig: {
        host: process.env.HOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT,
        database: process.env.DB,
    },
    authSecret: process.env.JWT_SECRET,
    emailConfig: {
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PASS,
    },
};

const bcrypt = require("bcryptjs");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
// const { signupPDF } = require("../helpers/signupPDF");

exports.fieldValidate = async (req, res) => {
    if (!req.body.fieldName && !req.body.value) {
        errorMessage.message = "body content must be provided!";
        return res.status(status.error).send(errorMessage);
    }
    let tableName = "client"; // By default let if look into client table
    if (req.body.target) {
        tableName = req.body.target;
    }
    try {
        const selectResponse = await db.query(
            `SELECT id, ${req.body.fieldName} FROM ${tableName} WHERE ${req.body.fieldName} = $1`,
            [req.body.value]
        );
        if (selectResponse.rows.length > 0) {
            errorMessage.message = {
                value: req.body.value,
                msg: `${req.body.value} already taken.`,
                param: `${tableName}.${req.body.fieldName}`,
            };
            return res.status(status.bad).send(errorMessage);
        }
        successMessage.message = {
            value: req.body.value,
            msg: `${req.body.value} can be used.`,
            param: `${tableName}.${req.body.fieldName}`,
        };
        res.status(status.success).send(successMessage);
    } catch (error) {
        return res.status(status.notfound).send(JSON.stringify(error));
    }
};

exports.signup = async (req, res) => {
    const pgClient = await db.getClient();
    const { clientName, firstname, lastname, email, password } = req.body;
    hashedPassword = bcrypt.hashSync(password, 8);
    try {
        const clientResponse = await pgClient.query(
            `INSERT INTO client(name, created) VALUES ('${clientName}', now()) RETURNING id`
        );
        if (!clientResponse.rowCount) {
            errorMessage.message = "Client Cannot be registered";
            res.status(status.notfound).send(errorMessage);
        }

        if (clientResponse.rowCount) {
            const forwarded = req.headers["x-forwarded-for"];
            const userIP = forwarded
                ? forwarded.split(/, /)[0]
                : req.connection.remoteAddress;
            const userResponse =
                await pgClient.query(`INSERT INTO users(firstname, lastname, client_id, email, password, admin, sign_dt, sign_ip_address, created) 
        VALUES ('${firstname}', '${lastname}', ${clientResponse.rows[0].id}, '${email}', '${hashedPassword}', true, now(), '${userIP}', now()) RETURNING id`);
            const clientRows = await pgClient.query(
                "SELECT id, name FROM client WHERE id = $1",
                [clientResponse.rows[0].id]
            );
            const userRows = await pgClient.query(
                "SELECT id, client_id, firstname, lastname, email, sign_ip_address, sign_dt FROM users WHERE id = $1",
                [userResponse.rows[0].id]
            );
            const responseData = {
                user: userRows.rows[0],
                client: clientRows.rows[0],
            };
            successMessage.message = "User successfully registered!";
            successMessage.data = responseData;

            res.status(status.created).send(successMessage);
        }
    } catch (err) {
        errorMessage.message = err.message;
        res.status(status.error).send(errorMessage);
    }
};

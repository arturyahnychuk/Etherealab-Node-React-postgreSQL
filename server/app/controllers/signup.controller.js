const bcrypt = require("bcryptjs");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
const config = require("../../config");
const jwt = require("jsonwebtoken");

exports.fieldValidate = async (req, res) => {
    if (!req.body.fieldName && !req.body.value) {
        errorMessage.message = "body content must be provided!";
        return res.status(status.error).send(errorMessage);
    }
    let tableName = "client";
    if (req.body.target) {
        tableName = req.body.target;
    }
    try {
        const selectResponse = await db.query(
            `select 1 from ${tableName} where lower(${req.body.fieldName}) = $1 limit 1`,
            [req.body.value.toLowerCase()]
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
    const { clientName, firstname, lastname, email, password } = req.body;
    hashedPassword = bcrypt.hashSync(password, 8);
    try {
        const clientQuery = `insert into client (name) values ($1) returning id`;
        const clientParams = [clientName];
        const clientResponse = await db.query(clientQuery, clientParams);
        if (!clientResponse.rowCount) {
            errorMessage.message = "Client Cannot be registered";
            res.status(status.notfound).send(errorMessage);
        }

        const userQuery = `
            insert into users(firstname, lastname, client_id, email, password, created)
            values ($1, $2, $3, $4, $5, now())
            returning *
        `;
        const userParams = [
            firstname,
            lastname,
            clientResponse.rows[0].id,
            email,
            hashedPassword,
        ];
        const userResponse = await db.query(userQuery, userParams);
        let user = {
            id: userResponse.rows[0].id,
            client_id: userResponse.rows[0].client_id,
            email: userResponse.rows[0].email,
            lastname: userResponse.rows[0].lastname,
            firstname: userResponse.rows[0].firstname,
        };
        const token = jwt.sign(
            { id: user.id, client_id: user.client_id, role: "CLIENT" },
            config.authSecret,
            {
                expiresIn: 86400, // 24 hours
            }
        );
        const responseData = {
            user,
            accessToken: token,
        };
        successMessage.message = "User successfully registered!";
        successMessage.data = responseData;

        res.status(status.created).send(successMessage);
    } catch (err) {
        errorMessage.message = err.message;
        res.status(status.error).send(errorMessage);
    }
};

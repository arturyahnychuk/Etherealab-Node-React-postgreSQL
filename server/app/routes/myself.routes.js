const express = require("express");
const { authJwt } = require("../middlewares");

const db = require("../db");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { errorMessage, successMessage, status } = require("../helpers/status");
const router = express.Router();

router.get("/myself/profile", [authJwt.verifyToken], async (req, res) => {
    try {
        const dbResponse = await db.query(
            `select client_id,firstname, lastname, email from users where id = $1`,
            [req.user_id]
        );

        if (!dbResponse.rowCount) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        successMessage.data = dbResponse.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (err) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
});

router.put(
    "/myself/profile/:userId",
    [authJwt.verifyToken],
    async (req, res) => {
        const { firstname, lastname, email, password } = req.body.data;

        try {
            let $sql;
            $sql = `update users set firstname = $1, lastname = $2, email = $3`;

            const params = [firstname, lastname, email];
            let paramCount = 4;

            if (password) {
                $sql += `, password = $${paramCount}`;
                params.push(bcrypt.hashSync(password, 8));
                paramCount++;
            }

            $sql += `, updated = $${paramCount}, updated_user_id = $${
                paramCount + 1
            } where id = $${paramCount + 2}`;
            params.push(
                moment().format("YYYY-MM-DD hh:ss"),
                req.user_id,
                req.user_id
            );

            const updateResponse = await db.query($sql, params);

            if (!updateResponse.rowCount) {
                errorMessage.message = "Update not successful";
                return res.status(status.notfound).send(errorMessage);
            }
            successMessage.data = updateResponse.rows;
            successMessage.message = "Update successful";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = "Update not successful";
            return res.status(status.error).send(errorMessage);
        }
    }
);

module.exports = router;

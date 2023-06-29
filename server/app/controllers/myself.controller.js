const db = require("../db");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getProfile = async (req, res) => {
    try {
        const dbResponse = await db.query(
            `select firstname, lastname, email from users where id = $1`,
            [req.params.userId]
        );

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        successMessage.data = dbResponse.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (err) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const updateProfile = async (req, res) => {
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
};
const myself = {
    getProfile,
    updateProfile,
};

module.exports = myself;

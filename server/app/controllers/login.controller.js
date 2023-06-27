const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");
const config = require("../../config");
const { errorMessage, successMessage, status } = require("../helpers/status");

exports.signin = async (req, res) => {
    try {
        const response = await db.query(
            "SELECT id, client_id, firstname, lastname, password, email FROM users WHERE email = $1",
            [req.body.email]
        );

        const user = response.rows[0];

        if (!user) {
            errorMessage.message = "User not found";
            errorMessage.user = user;
            return res.status(status.notfound).send(errorMessage);
        }
        if (user.admin) {
            user.permissions = ["ADMIN"];
        }
        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!isPasswordValid) {
            errorMessage.message = "Wrong password!";
            errorMessage.user = user;
            return res.status(status.unauthorized).send(errorMessage);
        }

        // update user login_dt
        await db.query(
            `UPDATE users SET login_dt=now(), updated= now(), updated_user_id=$1 WHERE id =$2`,
            [user.id, user.id]
        );

        const token = jwt.sign(
            { id: user.id, client_id: user.client_id, role: "CLIENT" },
            config.authSecret,
            {
                expiresIn: 86400, // 24 hours
            }
        );
        const resData = {};
        resData.accessToken = token;
        delete user.password; // delete password from response
        resData.user = user;
        resData.user.role = "CLIENT";
        resData.user.login_url = `/login_client`;
        successMessage.data = resData;
        res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.message = err.message;
        res.status(status.error).send(errorMessage);
    }
};

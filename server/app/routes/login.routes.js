const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../../config");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
const router = express.Router();

router.post("/auth/login", async (req, res) => {
    try {
        const response = await db.query(
            `select id, client_id, firstname, lastname, password, email from users where email = $1`,
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

        /*
      await db.query(
          `update users set login_dt = now(), updated = now(), updated_user_id = $1 where id = $2`,
          [user.id, user.id]
      );
      */

        await db.query(`update users set login_dt = now() where id = $1`, [
            user.id,
        ]);

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
        resData.user.login_url = `/login`;
        successMessage.data = resData;
        res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.message = error.message;
        res.status(status.error).send(errorMessage);
    }
});

module.exports = router;

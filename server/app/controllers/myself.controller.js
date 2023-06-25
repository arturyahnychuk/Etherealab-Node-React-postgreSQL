const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getProfile = async (req, res) => {
    try {
        const dbResponse = await db.query(
            `select firstname, lastname, email, title, created, email_forward_user_id, phone, status, timezone
      from users where id=${req.params.userId}`
        );

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        successMessage.data = dbResponse.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (err) {
        console.log(err);
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const updateProfile = async (req, res) => {
    const { firstname, lastname, email, password } = req.body.data;

    try {
        const userProfile = await db.query(`select name, license
        from users
        where id =${id}`);

        if (userProfile.rows < 1) {
            errorMessage.message = "Client not found";
            return res.status(status.inValid).send(errorMessage);
        }

        let $sql;
        $sql = `update users set firstname='${firstname}', lastname='${lastname}', email='${email}''`;

        if (password) {
            $sql += `, password=${bcrypt.hashSync(password, 8)}`;
        }

        $sql += `, updated='${moment().format(
            "YYYY-MM-DD hh:ss"
        )}', updated_user_id=${req.user_id} where id =${
            req.user_id
        } RETURNING id`;

        const updateResponse = await db.query($sql);

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

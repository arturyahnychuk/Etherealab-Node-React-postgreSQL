const { errorMessage, successMessage, status } = require("../helpers/status");
const db = require("../db");

const getUser = async (req, res) => {
    try {
        const $sql = `select u.id, u.admin, u.client_id, u.firstname, u.lastname, u.email, u.sign_dt,  c.name
        from users u
        left join client c on c.id=u.client_id 
        where u.id=${req.user_id}
        `;

        const dbResponse = await db.query($sql);

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        const user = dbResponse.rows[0];
        if (user.admin) {
            user.permissions = ["ADMIN"];
        }
        user.role = "CLIENT";
        user.login_url = `/login_client`;
        successMessage.data = { user };
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const getClient = async (req, res) => {
    try {
        const dbResponse = await db.query(
            `select * from client where id=${req.client_id}`
        );

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        const client = dbResponse[0];
        successMessage.data = { client };
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const users = {
    getUser,
    getClient,
};

module.exports = users;

const { errorMessage, successMessage, status } = require("../helpers/status");
const db = require("../db");

const getUser = async (req, res) => {
    try {
        const $sql = `select u.id, u.admin, u.client_id, u.firstname, u.lastname, u.email, u.sign_dt, u.email_confirm_dt, c.name, c.calendar_start_time, c.calendar_end_time 
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
        console.log("error:", error);
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const response = await db.query(
            `select id, client_id, firstname, lastname, password
            from users
            where email = ${req.body.email}`
        );
        const user = response.rows[0];
        if (user) {
            errorMessage.message =
                "Email is already in our system. Try different values";
            return res.status(status.inValid).send(errorMessage);
        }
        errorMessage.message = "Email is Available";
        return res.status(status.success).send(errorMessage);
    } catch (error) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const getClientByName = async (req, res) => {
    try {
        const response = await db.query(
            `select 1 from client where name = ${req.body.clientName} limit 1`
        );
        if (response.length > 1) {
            errorMessage.message =
                "Client Name is already in our system. Try different values";
            return res.status(status.inValid).send(errorMessage);
        }
        errorMessage.message = "Client Name is Available";
        return res.status(status.success).send(errorMessage);
    } catch (error) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};
const users = {
    getUser,
    getClient,
    getUserByEmail,
    getClientByName,
};

module.exports = users;

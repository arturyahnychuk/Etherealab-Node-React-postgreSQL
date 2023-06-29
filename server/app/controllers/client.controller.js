const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getClientProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const clientProfile = await db.query(
            `select name, license from client where id = $1`,
            [id]
        );

        if (!clientProfile.rowCount) {
            errorMessage.message = "Client not found";
            return res.status(status.inValid).send(errorMessage);
        }
        successMessage.data = clientProfile.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.message = "Error when getting Client Profile";
        return res.status(status.error).send(errorMessage);
    }
};

const updateClientProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const updateResponse = await db.query(
            `update client set name = $1, license = $2 where id = $3`,
            [req.body.name, req.body.license, id]
        );

        if (!updateResponse.rowCount) {
            errorMessage.message = "Update not successful";
            return res.status(status.error).send(errorMessage);
        }

        successMessage.data = updateResponse.rows;
        successMessage.message = "Update successful";
        return res.status(status.created).send(successMessage);
    } catch (err) {
        errorMessage.message = "Update not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const Client = {
    updateClientProfile,
    getClientProfile,
};
module.exports = Client;

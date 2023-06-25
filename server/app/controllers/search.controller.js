const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getResult = async (req, res) => {
    const { query } = req.query;
    let $sql;
    try {
        // if (query.search)
        $sql = `
        select p.firstname, p.lastname, o.status, o.updated
        from orders o
        left join patient p on p.id = o.patient_id
        left join users u on u.id = o.updated_user_id
        where o.client_id = ${req.client_id}
        `;

        const dbResponse = await db.query($sql);

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        successMessage.data = dbResponse.rows;
        return res.status(status.created).send(successMessage);
    } catch (err) {
        console.error("err:", err);
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const Search = {
    getResult,
};

module.exports = Search;

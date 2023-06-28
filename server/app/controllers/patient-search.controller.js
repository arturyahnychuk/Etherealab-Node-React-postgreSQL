const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
const moment = require("moment");
const search = async (req, res) => {
    const { searchTerm } = req.body;

    let $sql;

    try {
        const translationMap = {
            STP: "Sent To Patient",
            IP: "In Progress",
            ARI: "All Results In",
            C: "Cancelled",
        };

        $sql = `
            select p.firstname, p.lastname, o.status, o.updated
            from orders o
            left JOIN patient p ON p.id = o.patient_id
            left JOIN users u ON u.id = o.updated_user_id
            where o.client_id = ${req.client_id}
          `;

        if (searchTerm) {
            $sql += `
              and (p.firstname like '%${searchTerm}%' or p.lastname like '%${searchTerm}%')
            `;
        }

        $sql += `
            order by o.updated desc
            limit 20
          `;

        const dbResponse = await db.query($sql);

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        const translatedResponse = dbResponse.rows.map((row) => {
            return {
                firstname: row.firstname,
                lastname: row.lastname,
                status: translationMap[row.status.trim()],
                updated: moment(row.updated).format("MMM, D YYYY"),
            };
        });

        successMessage.data = translatedResponse;
        return res.status(status.created).send(successMessage);
    } catch (err) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const PatientSearch = {
    search,
};

module.exports = PatientSearch;

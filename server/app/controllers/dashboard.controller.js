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
        let params = [];
        $sql = `
        select p.firstname, p.lastname, s.name status, o.created, o.updated
        from orders o
        left join patient p on p.id = o.patient_id
        left join users u on u.id = o.updated_user_id
		left join status s on s.id = o.status
        where o.client_id = $1
        `;
        params.push(req.client_id);

        if (searchTerm) {
            $sql += `
            and (lower(p.firstname) like $${params.length + 1} or lower(p.lastname) like $${
                params.length + 1
            })
            `;
            params.push(`%${searchTerm.toLowerCase()}%`);
        }

        $sql += `
            order by o.updated desc
            limit 20
        `;

        const dbResponse = await db.query($sql, params);

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }
        const translatedResponse = dbResponse.rows.map((row) => {
            return {
                firstname: row.firstname,
                lastname: row.lastname,
                status: row.status,
                created: moment(row.updated).format("MMM D, YYYY"),
                updated: moment(row.updated).format("MMM D, YYYY"),
            };
        });

        successMessage.data = translatedResponse;
        return res.status(status.created).send(successMessage);
    } catch (err) {
        errorMessage.message = "Select not successful";
        return res.status(status.error).send(errorMessage);
    }
};

const Dashboard = {
    search,
};

module.exports = Dashboard;

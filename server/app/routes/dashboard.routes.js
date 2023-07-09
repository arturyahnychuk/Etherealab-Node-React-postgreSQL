const express = require("express");
const { authJwt } = require("../middlewares");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");

const router = express.Router();

router.post(
    "/client/patient-search",
    [authJwt.verifyToken],
    async (req, res) => {
        const { searchTerm } = req.body;

        let $sql;

        try {
            let params = [];

            $sql = `
          select p.id patient_id
              , p.firstname
              , p.lastname
              , s.name status
              , to_char(o.created::date, 'Mon d, yyyy') created
              , to_char(o.updated::date, 'Mon d, yyyy') updated
              , o.id order_id
          from orders o
          left join patient p on p.id = o.patient_id
          left join users u on u.id = o.updated_user_id
          left join status s on s.id = o.status
          where o.client_id = $1
      `;

            params.push(req.client_id);

            if (searchTerm) {
                $sql += `
          and (lower(p.firstname) like $${
              params.length + 1
          } or lower(p.lastname) like $${params.length + 1})
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

            successMessage.data = dbResponse.rows;
            return res.status(status.created).send(successMessage);
        } catch (err) {
            errorMessage.message = "Select not successful";
            return res.status(status.error).send(errorMessage);
        }
    }
);

module.exports = router;

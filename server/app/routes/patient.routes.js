const express = require("express");
const { authJwt } = require("../middlewares");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
const router = express.Router();

router.post(
    "/patient/create-patient",
    [authJwt.verifyToken],
    async (req, res) => {
        const { firstname, lastname, email } = req.body;

        try {
            const dbResponse = await db.query(
                `insert into patient (client_id, firstname, lastname, email, created, created_user_id)
                values ($1, $2, $3, $4, now(), $5) returning id, firstname, lastname`,
                [req.client_id, firstname, lastname, email, req.user_id]
            );

            if (!dbResponse.rowCount) {
                errorMessage.message = "Patient Creation Failed";
                return res.status(status.inValid).send(errorMessage);
            }

            successMessage.message = "Patient successfully registered!";
            successMessage.data = dbResponse.rows[0];
            return res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = "Error while creating patient";
            return res.status(status.error).send(errorMessage);
        }
    }
);
router.put(
    "/patient/:patient_id/update-patient",
    [authJwt.verifyToken],
    async (req, res) => {
        const { patient_id } = req.params;
        const { email, lastname, firstname } = req.body;
        try {
            const updateResponse = await db.query(
                `
                update patient
                    set firstname = $1
                    , lastname = $2
                    , email = $3
                where id = $4
                and client_id = $5
                `,
                [firstname, lastname, email, patient_id, req.client_id]
            );
            if (!updateResponse.rowCount) {
                errorMessage.message = "Update Patient not successful";
                return res.status(status.notfound).send(errorMessage);
            }
            successMessage.data = updateResponse.rows;
            successMessage.message = "Update Patient successful";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = "Error while updating patient";
            return res.status(status.error).send(errorMessage);
        }
    }
);

router.get("/patient/:patient_id", [authJwt.verifyToken], async (req, res) => {
    const { patient_id } = req.params;
    try {
        const dbResponse = await db.query(
            `
                select firstname, lastname, email, client_id
                from patient
                where id = $1
                and client_id = $2`,
            [patient_id, req.client_id]
        );

        if (!dbResponse.rowCount) {
            errorMessage.message = "No patient found";
            return res.status(status.notfound).send(errorMessage);
        }
        successMessage.message = "Fetched Patient successfully";
        successMessage.data = dbResponse.rows[0];
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.message = "Failed to get patient";
        return res.status(status.notfound).send(errorMessage);
    }
});

router.get(
    "/patient/:patient_id/orders",
    [authJwt.verifyToken],
    async (req, res) => {
        const { patient_id } = req.params;
        try {
            const dbResponse = await db.query(
                `
                select o.id order_id
                    , to_char(o.created::date, 'Mon d, yyyy') order_created
                    , to_char(o.updated::date, 'Mon d, yyyy') order_updated
                    , s.name order_status
                    , concat (u.firstname, ' ', u.lastname) order_created_user
                    , lc.name lab_company_name
                    , lct.name lab_company_test_name
                    , string_agg(st.name, ', ') sample_type_name
                    , s2.name order_item_status
                    , to_char(oi.updated::date, 'Mon d, yyyy') order_item_updated
                from orders o
                left join order_item oi on oi.order_id = o.id
                left join lab_company_test lct on lct.id = oi.lab_company_test_id
                left join lab_company lc on lc.id = lct.lab_company_id
                left join lab_company_test_sample lcts on lcts.lab_company_test_id = lct.id
                left join sample_type st on st.id = lcts.sample_type_id
                left join users u on u.id = o.created_user_id
                left join status s on s.id = o.status
                left join status s2 on s2.id = oi.status
                where o.patient_id = $1
                and o.client_id = $2
                group by o.id, s.name, u.firstname, u.lastname, lc.name, lct.name, s2.name, oi.updated
                order by 1 desc
                limit 20
                `,
                [patient_id, req.client_id]
            );

            if (!dbResponse.rowCount) {
                errorMessage.message = "No patient order found";
                return res.status(status.notfound).send(errorMessage);
            }
            successMessage.data = dbResponse.rows;
            return res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = "Failed to get patient orders";
            return res.status(status.notfound).send(errorMessage);
        }
    }
);

router.post("/patient/search", [authJwt.verifyToken], async (req, res) => {
    const { term } = req.body;
    try {
        const patients = await db.query(
            `
            select id, firstname, lastname
            from patient
            where client_id = $1
            and (lower(firstname) like '%' || lower($2) || '%'
            or lower(lastname) like '%' || lower($2) || '%'
            or lower(email) like '%' || lower($2) || '%')
            limit 20
            `,
            [req.client_id, term]
        );
        successMessage.data = patients.rows;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.message = "Error while searching client patients";
        return res.status(status.error).send(errorMessage);
    }
});

router.post(
    "/patient/email/validate",
    [authJwt.verifyToken],
    async (req, res) => {
        const { email } = req.body;
        try {
            const selectResponse = await db.query(
                `
                select 1 from patient 
                where client_id = $1 
                and lower(email) = $2
                limit 1
                `,
                [req.client_id, req.email]
            );
            if (selectResponse.rows.length > 0) {
                errorMessage.message = {
                    value: email,
                    msg: `${email} already taken.`,
                };
                return res.status(status.bad).send(errorMessage);
            }
            successMessage.message = {
                value: email,
                msg: `${email} can be used.`,
            };
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = "Failed to select patient";
            return res.status(status.notfound).send(errorMessage);
        }
    }
);

module.exports = router;

const db = require("../db");
const { status, successMessage, errorMessage } = require("../helpers/status");

const searchPatientsByClientId = async (req, res) => {
    const { term } = req.body;
    try {
        const patients = await db.query(
            `select id, firstname, lastname
            from patient
            where client_id = $1
              and (lower(firstname) like '%$2%' 
                or lower(lastname) like '%$2%'
                or lower(email) like '%$2%'`,
            [req.client_id, term]
        );
        successMessage.data = patients.rows;
        return res.status(status.created).send(successMessage);
    } catch (error) {
        errorMessage.message = "Error while searching client patients";
        return res.status(status.error).send(errorMessage);
    }
};

const createPatient = async (req, res) => {
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
};

const validateEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const selectResponse = await db.query(
            `select 1 from patient where client_id = $1 and lower(email) = $2 limit 1 `,
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
};
const Patient = {
    createPatient,
    searchPatientsByClientId,
    validateEmail,
};
module.exports = Patient;

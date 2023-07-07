const express = require("express");
const db = require("../db");
const { errorMessage, successMessage, status } = require("../helpers/status");
const { authJwt } = require("../middlewares");

const router = express.Router();

router.post("/catalog/search", [authJwt.verifyToken], async (req, res) => {
    const { text, labCompanyId, favorite } = req.body.data;
    try {
        let $sql = `
            select lc.id lab_company_id
            , lc.name lab_company_name
            , lct.id lab_company_test_id
            , lct.name lab_company_test_name
            , lct.msrp test_msrp
            , lct.price test_price
            , string_agg(st.name, ', ') sample_type_name
            , lctf.lab_company_test_id favorite_id
        from lab_company lc
        join lab_company_test lct on lct.lab_company_id = lc.id
        left join lab_company_test_sample lcts on lcts.lab_company_test_id = lct.id
        left join sample_type st on st.id = lcts.sample_type_id
        left join lab_company_test_favorite lctf on lctf.client_id = $1
            and lctf.lab_company_test_id = lct.id
        where true`;

        const params = [req.client_id];
        let paramIndex = 2;

        if (favorite) {
            $sql += `
            and lctf.lab_company_test_id is not null`;
        }
        if (labCompanyId) {
            const placeholders = labCompanyId
                .map((_, i) => `$${paramIndex++}`)
                .join(", ");
            $sql += `
            and lc.id in (${placeholders})`;
            params.push(...labCompanyId);
        }
        if (text) {
            $sql += `
            and lower(lct.name) like $${paramIndex++}`;
            params.push(`%${text.toLowerCase()}%`);
        }

        $sql += `
		group by lc.id 
          , lc.name 
          , lct.id 
          , lct.name 
          , lct.msrp 
          , lct.price 
          , lctf.lab_company_test_id
        order by lc.name, lct.name
        limit 100`;

        const dbResponse = await db.query($sql, params);

        if (!dbResponse) {
            errorMessage.message = "None found";
            return res.status(status.notfound).send(errorMessage);
        }

        successMessage.data = dbResponse.rows;
        return res.status(status.created).send(successMessage);
    } catch (err) {
        errorMessage.message = "Catalog search not successful";
        return res.status(status.error).send(errorMessage);
    }
});
router.get(
    "/catalog/lab-companies",
    [authJwt.verifyToken],
    async (req, res) => {
        try {
            const dbResponse = await db.query(
                `select id, name from lab_company order by name limit 100`
            );

            if (!dbResponse) {
                errorMessage.message = "None found";
                return res.status(status.notfound).send(errorMessage);
            }
            successMessage.data = dbResponse.rows;
            return res.status(status.created).send(successMessage);
        } catch (err) {
            errorMessage.message = "Get Lab Companies not successful";
            return res.status(status.error).send(errorMessage);
        }
    }
);
router.post(
    "/catalog/lab-company/favorite",
    [authJwt.verifyToken],
    async (req, res) => {
        const { labCompanyTestId } = req.body;

        try {
            const dbResponse = await db.query(
                `insert into lab_company_test_favorite values ($1, $2, now(), $3) returning lab_company_test_id`,
                [req.client_id, labCompanyTestId, req.user_id]
            );

            if (!dbResponse) {
                errorMessage.message = "Add Favorite not successful";
                return res.status(status.notfound).send(errorMessage);
            }

            successMessage.data = dbResponse.rows[0];
            successMessage.message = "Add Favorite successful";
            return res.status(status.created).send(successMessage);
        } catch (err) {
            errorMessage.message = "Add Favorite not successful";
            return res.status(status.error).send(errorMessage);
        }
    }
);
router.delete(
    "/catalog/lab-company/favorite/:id",
    [authJwt.verifyToken],
    async (req, res) => {
        const { id } = req.params;

        try {
            const deleteResponse = await db.query(
                `
                delete 
                from lab_company_test_favorite
                where client_id = $1
                and lab_company_test_id = $2`,
                [req.client_id, id]
            );
            if (!deleteResponse.rowCount) {
                errorMessage.message = "Remove Favorite  not successful";
                return res.status(status.notfound).send(errorMessage);
            }
            successMessage.data = deleteResponse.rows;
            successMessage.message = "Remove Favorite successful";
            return res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = "Remove Favorite not successful";
            return res.status(status.error).send(errorMessage);
        }
    }
);
module.exports = router;

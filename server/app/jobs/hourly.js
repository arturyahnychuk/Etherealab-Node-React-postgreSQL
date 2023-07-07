/*
David
July 4 2023
This job sends an email to patients to purchase lab tests
Test the job from command line: "node ./server/app/jobs/hourly.js"
*/
const nodeCron = require("node-cron");
const jwt = require("jsonwebtoken");

const db = require("../db");
const { transporter, sgMail } = require("../routes/password-reset.routes");

const job = nodeCron.schedule("0 * * * * *", async () => {
    try {
        sql = `
        select o.id order_id
            , o.created
            , p.email
            , p.firstname
            , c.name client_name
            , concat(u.firstname, ' ', u.lastname) provider_name
            , current_date - o.created::date order_created_days
        from orders o
        left join patient p on p.id = o.patient_id
        left join client c on c.id = p.client_id
        left join users u on u.id = o.created_user_id
        left join patient_order_notify_log ponl on ponl.order_id = o.id
            and ponl.dt = current_date
        where o.status = 'STP' /*yes there is an index on o.status*/
        and ponl.dt is null /*was not sent today*/
        and current_date - o.created::date in (0,1,2,4,7,14,21,30)
        `;

        //send sql to database
        const result = await db.query(sql);

        result.rows.forEach(async (row) => {
            const { order_id, email, firstname, provider_name } = row;
            function encryptOrderId(order_id) {
                const secretKey = process.env.JWT_SECRET;
                return jwt.sign({ order_id }, secretKey);
            }
            // Generate the URL with the encrypted order_id
            const url = `https://app.myeasylabs.com/patient-purchase?oid=${encryptOrderId(
                order_id
            )}`;

            const labTestTemplate = (email, firstname, provider_name, url) => {
                const from = process.env.EMAIL_LOGIN;
                const to = email;
                const subject = "Lab Test";
                const html = `
                Hi ${firstname},
                ${provider_name} has ordered lab testing for you.
                Click here ${url} to purchase the tests.
              `;

                return { from, to, subject, html };
            };

            const emailTemplate = labTestTemplate(
                email,
                firstname,
                provider_name,
                url
            );
            if (process.env.NODE_ENV === "production") {
                await sgMail.send(emailTemplate);
            } else {
                await transporter.sendMail(emailTemplate);
            }

            notifyQuery =
                "insert into patient_order_notify_log values ($1, current_date)";
            await db.query(notifyQuery, [order_id]);
        });

        //url = "https://app.myeasylabs.com/patient-purchase?oid=$oid"
        //$oid is the order_id encrypted.  make it at least 64 characters.
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});

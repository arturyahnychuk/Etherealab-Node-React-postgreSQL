/*
David
July 4 2023
Test the job from command line: "node ./server/jobs/hourly.js"
*/

const nodeCron = require("node-cron");

const job = nodeCron.schedule("0 * * * * *", () => {

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
        `

    //send sql to database

    //for each row returned:

        //send the following email

        //url = "https://app.myeasylabs.com/patient-purchase?oid=$oid"
            //$oid is the order_id encrypted.  make it at least 64 characters.

        body = `
            Hi $firstname,
            $provider_name has ordered lab testing for you.
            Click here {$url} to purchase the tests.
        `

        //send email
        
        sql = "insert into patient_order_notify_log values ($order_id, current_date)"

});

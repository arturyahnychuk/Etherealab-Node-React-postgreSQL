const postgres = require("pg");
const util = require("util");
const config = require("../../config");
const { errorMessage, status } = require("../helpers/status");

const dbConfig = config.dbconfig;

const configuration = {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port,
    database: dbConfig.database,
};

function makeDb(databaseConfig, res) {
    const connection = postgres.createConnection(databaseConfig);
    connection.connect(function (error) {
        if (error) {
            console.error(`error connecting: ${error.stack}`);

            if (error.code === "ECONNREFUSED") {
                errorMessage.message =
                    "Something went wrong with the database connection";
                return res.status(status.error).send(errorMessage);
            }
            errorMessage.message =
                "Something went wrong with the database query";
            return res.status(status.error).send(errorMessage);
        }
        return false;
    });
    return {
        query(sql, args) {
            if (process.env.NODE_ENV === "development") {
                console.log(sql);
                if (args) {
                    console.log(args);
                }
            }
            connection.query("set SESSION group_concat_max_len = 10000"); // To increase default length of group_concat
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
    };
}

const db = {
    configuration,
    makeDb,
};

module.exports = db;

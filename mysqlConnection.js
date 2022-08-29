const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "PiLabs21!",
    database: "umls",
    port: "3306"
});

module.exports = db;
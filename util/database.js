const mysql = require('mysql2');

Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "usrdata",
    port: process.env.DB_PORT
});

Connection.connect((err) => {
    if (err) {
        console.error("Failed to connect to database: %s.", err);
        process.exit(1);
    }
    console.log("Connected to database.");
});


module.exports = Connection;
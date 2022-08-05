const mysql = require('mysql2/promise');

let Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "usrdata",
    port: process.env.DB_PORT
});

let connect = () => {
    Connection.connect((err) => {
        if (err) {
            console.error("Failed to connect to database: %s.", err);
            process.exit(1);
        }
        console.log("Connected to database.");
    });
}


Connection.on('error', (err) => {
    console.error('DB ERROR', err);
    switch (err.code) {
        case 'PROTOCOL_CONNECTION_LOST':
            connect();
        break;

        case 'ECONNREFUSED':
            throw err;
        break;

        case 'ER_ACCESS_DENIED_ERROR':
            throw err;
        break;

        default:
            throw err;
        break;
    }
});

connect();

module.exports = Connection;
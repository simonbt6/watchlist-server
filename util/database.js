const mysql = require('mysql2');

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
    if (err.code == 'PROTOCOL_CONNECTION_LOST') {
        connect();
    }
    else throw err;
});

connect();

module.exports = Connection;
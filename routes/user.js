const { now } = require('../util/time');
const Crypto = require('crypto');
const db = require('../util/database');


module.exports = {
    GetAll: (req, res) => {
        db.query(`SELECT name, uuid, created_at, updated_at FROM user`, (err, rs) => {
            if (err) throw err;
            
            if (rs.length == 0) {
                res.send("No user to display.");
                return;
            }

            res.send(rs);
        });
    },

    /**
     * **Requires uuid param.**
     * @param {*} req 
     * @param {*} res 
     */
    GetByUUID: (req, res) => {
        db.query(
            `SELECT name, uuid, created_at, updated_at FROM user WHERE uuid="${req.params.uuid}"`, 
            (err, rs1) => {
                if (err) throw err;
                
                if (rs1.length == 0) {
                    res.send("User not found.");
                    return;
                }
        
                if (rs1.length > 1) {
                    throw new Error("Too many rows to result.");
                }

                db.query(
                    `SELECT name, uuid, created_at, updated_at FROM watchlist WHERE owner_id="${rs1[0].uuid}" AND deleted_at IS NULL;`, 
                    (err, rs2) => {
                        if (err) throw err;

                        rs1[0].watchlists = rs2;
                
                        res.send(rs1);
                });
        });
    },

    /**
     * **Requires name param.**
     * @param {*} res 
     * @param {*} req 
     */
    Create: (req, res) => {
        let uuid = Crypto.randomUUID();
        db.query(`INSERT INTO user (name, uuid) VALUES ('${req.params.name}', '${uuid}');`, (err, rs) => {
            if (err) throw err;

            if (rs.affectedRows < 1) {
                res.statusCode = 400;
                console.error(`Failed to add user to database. username=${req.params.name}`);
                res.send({error: "Failed to add new user to database."});
                return;
            }
            res.statusCode = 200;
            console.log("New user added to database.");
            res.send({uuid});
        });
    },
        
    /**
     * **Requires uuid param.**
     * @param {*} req 
     * @param {*} res 
     */
    Delete: (req, res) => {
        let deleted_at = now();
        db.query(`UPDATE user SET deleted_at='${deleted_at}' WHERE uuid='${req.params.uuid}';`, (err, rs) => {
            if (err) throw err;
            console.log(`Removed user identified as ${req.params.id} from user table.`);
            res.statusCode = rs.affectedRows > 0 ? 200 : 400;
            res.send();
        });
    }
}
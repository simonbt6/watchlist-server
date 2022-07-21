const { now } = require('../util/time');
const Crypto = require('crypto');
const db = require('../util/database');


module.exports = {
    GetAll: (req, res) => {
        db.query(`SELECT * FROM watchlist WHERE deleted_at IS NULL;`, (err, rs) => {
            if (err) throw err;
    
            if (rs.length < 1) {
                res.send("No watchlist to display.");
                return;
            }
    
            res.send(rs);
        });
    },

    /**
     * @param {*} uuid 
     */
    GetByUUID: (req, res) => {
        db.query(
            `SELECT name, uuid, owner_id, created_at, updated_at FROM watchlist WHERE uuid='${req.params.uuid}' AND deleted_at IS NULL;`, 
            (err, rs1) => {
                if (err) throw err;
                if (rs1.length < 1) {
                    res.send("No watchlist to display.");
                    return;
                }

                db.query(
                    `SELECT name, uuid, url, created_at, updated_at FROM watchlist_item WHERE watchlist_id='${req.params.uuid}' AND deleted_at IS NULL`, 
                    (err, rs2) => {
                        if (err) throw err;

                        res.send({watchlist: rs1[0], items: rs2});
                });
        });
    },

    /**
     * 
     * @param {*} uuid 
     * @param {*} item 
     */
    GetItem: (req, res) => {

        db.query(
            `SELECT * FROM watchlist_item WHERE uuid='${req.params.item}' AND watchlist_id='${req.params.uuid}' WHERE deleted_at IS NULL;`, 
            (err, rs) => {
                if (err) throw err;

                if (rs.length < 1) {
                    res.statusCode = 400;
                    res.send(`No watchlist item to display.`);
                    return;
                }

                res.send(rs);
        });

    },

    /**
     * **Requires *name* & *owner* json body.**
     */
    Create: (req, res) => {
        if (!req.body || !req.body.name || !req.body.owner) {
            res.statusCode = 400;
            res.send("Please provide a valid request body.");
            return;
        }
        let uuid = crypto.randomUUID();
        db.query(`SELECT id FROM user WHERE uuid='${req.body.owner}'`, (err, rs) => {
            if (err) throw err;
    
            if (rs.length < 1) {
                res.statusCode = 400;
                res.send("Invalid owner id.");
                return;
            }
    
            db.query(
                `INSERT INTO watchlist (name, uuid, owner_id) VALUES ('${req.body.name}', '${uuid}', '${req.body.owner}');`, 
                (err, rs) => {
                    if (err) throw err;
        
                    if (rs.affectedRows < 1) {
                        res.statusCode = 400;
                        res.send(`Failed to create watchlist.`);
                        return;
                    }
        
                    res.send({uuid});
            });
        });
    },

    /**
     * **Requires *name* and *url* json body.**
     * @params {*} uuid
     */
     AddItem: (req, res) => {
        if (!req.body || !req.body.name || !req.body.url) {
            res.send(`Invalid request body.`);
            return;
        }
        
        let uuid = Crypto.randomUUID();
        db.query(
            `INSERT INTO watchlist_item (name, uuid, url, watchlist_id) VALUES ('${req.body.name}', '${uuid}', '${req.body.url}', '${req.params.uuid}')`, 
            (err, rs) => {
                if (err) throw err;
                if (rs.affectedRows < 1) {
                    console.error(`Failed to add item to watchlist.`)
                }
            
                res.send(uuid);
        });
    },

    /**
     * @param {*} uuid 
     */
    Delete: (req, res) => {
        let deleted_at = now();
        db.query(
            `UPDATE watchlist SET deleted_at='${deleted_at}' WHERE uuid='${req.params.uuid}';`, 
            (err, rs) => {
                if (err) throw err;
    
                if (rs.affectedRows < 1) {
                    res.statusCode = 400;
                    res.send(`Failed to remove watchlist ${req.params.uuid}.`);
                    return;
                }
    
                res.send(`Removed watchlist ${req.params.uuid}.`);
        });
    },

    /**
     * 
     * @param {*} uuid 
     * @param {*} item 
     */
    DeleteItem: (req, res) => {
        let deleted_at = now();
        db.query(
            `UPDATE watchlist_item SET deleted_at='${deleted_at}' WHERE uuid='${req.params.item}' AND watchlist_id='${req.params.uuid}';`,
            (err, rs) => {
                if (err) throw err;

                if (rs.affectedRows < 1) {
                    res.status = 400;
                    res.send(`Failed to remove watchlist item ${req.params.item} from ${req.params.uuid}.`);
                    return;
                }

                res.send(`Removed watchlist item ${req.params.item} from ${req.params.uuid}.`);
            }
        );
    },
}
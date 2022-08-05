const { now } = require('../util/time');
const Crypto = require('crypto');
const db = require('../util/database');
const Verif = require('../util/verif');


module.exports = {
    GetAll: async (req, res) => {
        try {

        }
        catch (err){

        }

        db.query(`SELECT * FROM watchlist WHERE deleted_at IS NULL;`, 
        (err, rs) => {
            if (err) throw err;
    
            if (rs.length < 1) {
                res.send([]);
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
                if (rs1.length < 1) {
                    res.statusCode = 400;
                    res.send({
                        error: {
                            code: `NO_MATCH`,
                            description: `Invalid watchlist uuid.`
                        }
                    });
                    return;
                }

                db.query(
                    `SELECT name, uuid, url, created_at, updated_at FROM watchlist_item WHERE watchlist_id='${req.params.uuid}' AND deleted_at IS NULL;`, 
                    (err, rs2) => {

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

                if (rs.length < 1) {
                    res.statusCode = 400;
                    res.send({
                        error: {
                            code: `NO_MATCH`,
                            description: `No watchlist item to display.`
                        }
                    });
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
            res.send({
                error: {
                    code: `INVALID_REQUEST_BODY`,
                    description: `Please provide a valid request body.`
                }
            });
            return;
        }
        let uuid = Crypto.randomUUID();
        db.query(`SELECT id FROM user WHERE uuid='${req.body.owner}';`, (err, rs) => {
            if (rs.length < 1) {
                res.statusCode = 400;
                res.send({
                    error: {
                        code: `EMPTY_RESPONSE`,
                        description: `Invalid owner id.`
                    }
                });
                return;
            }
    
            db.query(
                `INSERT INTO watchlist (name, uuid, owner_id) VALUES ('${req.body.name}', '${uuid}', '${req.body.owner}');`, 
                (err, rs) => {        
                    if (rs.affectedRows < 1) {
                        res.statusCode = 400;
                        res.send({
                            error: {
                                code: err.code,
                                description: `Failed to create watchlist.`
                            }
                        });
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
     AddItem: async (req, res) => {
        // Request Param Validation
        if (!req.body || !req.body.name || !req.body.url) {
            res.statusCode = 400;
            res.send({
                error: {
                    code: `INVALID_REQUEST_BODY`,
                    description: `Please provide a valid request body.`
                }
            });
            return;
        }

        // URL Validation
        if (!Verif.CheckURL(req.body.url)) {
            res.statusCode = 400;
            res.send({
                error: {
                    code: `INVALID_URL`,
                    description: `Please provide a valid url.`
                }
            });
            return;
        }

        // Duplicate verification
        db.query(`SELECT * FROM watchlist_item WHERE url='${req.body.url}' AND watchlist_id='${req.params.uuid}' AND deleted_at IS NULL;`, (err, rs1) => {
            if (rs1.length > 0) {
                res.statusCode = 400;
                res.send({
                    error: {
                        code: `DUPLICATE_ITEM_URL`,
                        description: `Item URL already exists in watchlist.`
                    }
                });
                return;
            }

            let uuid = Crypto.randomUUID();
            db.query(`INSERT INTO watchlist_item (name, uuid, url, watchlist_id) VALUES ('${req.body.name}', '${uuid}', '${req.body.url}', '${req.params.uuid}')`, (err, rs2) => {
                if (rs2.affectedRows < 1) {
                    res.statusCode = 400;
                    res.send({
                        error: {
                            code: err.code,
                            description: `Failed to add item to watchlist.`
                        }
                    });
                    console.error(`Failed to add item to watchlist.`);
                    return;
                }
            res.send(uuid);
            }); 
        });
    },

    /**
     * ``user_id`` header **required**  
     *   
     * **Success**: 200  
     * **Failed**: 400
     * @param {*} uuid 
     */
    Delete: (req, res) => {
        let deleted_at = now();
        db.query(
            `UPDATE watchlist SET deleted_at='${deleted_at}' WHERE uuid='${req.params.uuid}';`, 
            (err, rs) => {    
                if (rs.affectedRows < 1) {
                    res.statusCode = 400;
                    res.send({error: `Failed to remove watchlist ${req.params.uuid}.`});
                    return;
                }
    
                res.send(`Removed watchlist ${req.params.uuid}.`);
        });
    },

    /**
     * **Success**: 200  
     * **Failed**: 400
     * @param {*} uuid 
     * @param {*} item 
     */
    DeleteItem: (req, res) => {
        let deleted_at = now();
        db.query(
            `UPDATE watchlist_item SET deleted_at='${deleted_at}' WHERE uuid='${req.params.item}' AND watchlist_id='${req.params.uuid}';`,
            (err, rs) => {

                if (rs.affectedRows < 1) {
                    res.status = 400;
                    res.send({
                        error: {
                            code: `NO_MATCH`,
                            description: `Failed to remove watchlist item ${req.params.item} from ${req.params.uuid}.`
                        }
                    });
                    return;
                }

                res.send(`Removed watchlist item ${req.params.item} from ${req.params.uuid}.`);
            }
        );
    },
}
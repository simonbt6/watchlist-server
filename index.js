require('dotenv').config();

const express = require("express");
const morgan = require('morgan');
const crypto = require('crypto');
const moment = require("moment");
const clean_routes = require('express-clean-routes');
const routes = require('./routes');
const database = require('./util/database');

let app = express();


/**
 * Middlewares
 * 
 */
app.use(morgan('dev'));
app.use(express.json());
app.use('/', clean_routes(routes));


app.listen(process.env.EXPRESS_PORT, () => {
    console.log("Express listening on port %s.", process.env.EXPRESS_PORT);
});
require('dotenv').config();

const express = require("express");
const morgan = require('morgan');
const crypto = require('crypto');
const moment = require("moment");
const clean_routes = require('express-clean-routes');
const routes = require('./routes');
const database = require('./util/database');
const cors = require('cors');

let app = express();


/**
 * Middlewares
 * 
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use('/', clean_routes(routes));

app.listen(process.env.EXPRESS_PORT, () => {
    console.log("Express listening on port %s.", process.env.EXPRESS_PORT);
});
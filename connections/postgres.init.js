"use strict";

const conf = require("../config");
const logger = require("../logger");
const knex_configuration = require("../db/knexfile")[conf.nodeEnv];

const memeDb = require("knex")(knex_configuration);


function disconnect() {
    memeDb.destroy(err => {
        if (err) logger.error(err);
    });
}

module.exports = {
    memeDb,
    disconnect
};

"use strict";

const path = require("path");
const conf = require("../config");

module.exports = {
    test: {
        client: "pg",
        connection: conf.postgres.meme,
        migrations: {
            directory: path.join(__dirname, "./migrations")
        }
    },
    development: {
        client: "pg",
        connection: conf.postgres.meme,
        migrations: {
            directory: path.join(__dirname, "./migrations")
        }
    },
    production: {
        client: "pg",
        connection: conf.postgres.meme,
        migrations: {
            directory: path.join(__dirname, "./migrations")
        }
    }
};

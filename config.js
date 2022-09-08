"use strict";

const _ = require("lodash");
const convict = require("convict");

const conf = convict({
    env: {
        doc: "env",
        format: String,
        default: null,
        env: "ENV",
        arg: "env"
    },
    nodeEnv: {
        doc: "node env",
        format: String,
        default: null,
        env: "NODE_ENV",
        arg: "node_env"
    },
    port: {
        doc: "The port to bind",
        format: "port",
        default: 9090,
        env: "PORT",
        arg: "port"
    },
    logger: {
        level: {
            doc: "Logger Level",
            format: String,
            default: "info",
            env: "LOGGER_LEVEL",
            arg: "logger_level"
        }
    },

    // DBs
    postgres: {
        meme: {
            doc: "postgresql url of service's DB",
            format: String,
            default: null,
            env: "POSTGRES_MEME_READ_WRITE",
            arg: "postgres_meme_read_write"
        }
    }
});

// Perform validation
conf.validate({
    allowed: "strict"
});

_.extend(conf, conf.get());

module.exports = conf;

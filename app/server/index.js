"use strict";

const conf = require("../../config");
const logger = require("../../logger");
const app = require("./server");

const PORT = conf.get("port");

const onStartup = function() {
    logger.info("Server started at http://localhost:" + PORT);
};

const server = app.listen(PORT, onStartup);

const onShutdown = function() {
    server.close(() => {
        logger.info("Server closed");
    });
};

module.exports = {
    shutdown: onShutdown
};

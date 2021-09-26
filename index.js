"use strict";

const server = require("./app/server");

process.on("SIGTERM", function() {
    server.shutdown();
    process.exit(0);
});

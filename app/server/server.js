"use strict";

const express = require("express");
const createError = require("http-errors");

const logger = require("../../logger");
const conf = require("../../config");
const v1Router = require("./routes/v1.0");

const app = express();

const checkHealth = (_req, res) => {
    return res.json({ ok: "ok" });
};

app.get("/_readyz", checkHealth);

app.use(express.json());

app.use("/v1.0", v1Router);

app.use((req, res, next) => {
    let err = createError(404);
    err.message = `Not Found: ${req.originalUrl}`;
    err.errorCode = "CG-0404";
    next(err);
});

app.use((error, req, res, next) => {
    error = error || {};
    logger.error(error.message);
    const status = error.status || 500;
    res.status(status);

    let error_response = {
        message: error.message || "Unknown",
        status: status,
        exception: error.name
    };
    /* istanbul ignore else */
    if (conf.get("env") === "development") {
        error_response.stackTrace = error.stack || "";
    }
    /* istanbul ignore if */
    if (error.meta) {
        error_response.meta = error.meta;
    }
    res.json(error_response);
});

module.exports = app;

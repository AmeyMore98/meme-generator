"use strict";

const { validationResult } = require("express-validator");
const logger = require("../../../logger");


module.exports = {
    validate: (req, res, next) => {
        const errors = validationResult(req).formatWith(({ msg }) => msg);

        if (errors.isEmpty()) {
            next();
        } else {
            const error = new Error("Unexpected input value");
            error.status = 422;
            error.meta = { errors: errors.mapped() };
            error.name = "ValidationError";
            logger.error(error.meta);
            throw error;
        }
    }
};

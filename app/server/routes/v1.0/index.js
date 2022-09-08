"use strict";

const router = require("express").Router();

const memesRouter = require("./memes.route");

router.use("/memes", memesRouter);

module.exports = router;

"use strict";

const supertest = require("supertest");
const server = require("../../app/server/server");

module.exports = supertest(server);

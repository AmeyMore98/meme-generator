"use strict";

const { memeDb } = require("../connections/postgres.init");

beforeAll(async() => {
    await memeDb.migrate.rollback();
    await memeDb.migrate.latest();
    console.log("beforeAll started");
});

afterAll(async() => {
    await memeDb.migrate.rollback();
    console.log("afterAll completed");
});

"use strict";

const request = require("../../../fixture/request.fixture");

describe("Readyz Check", () => {

    it("should return 200", async() => {
        const res = await request
            .get("/_readyz");

        expect(res.status).toBe(200);
    });

});

describe("Non existent endpoint", () => {

    it("Should return 404", async() => {
        const res = await request
            .get("/this-does-not-exist");

        expect(res.status).toBe(404);
    });

});

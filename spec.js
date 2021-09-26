"use strict";

const Jasmine = require("jasmine");
const jas = new Jasmine();
const JasmineConsoleReporter = require("jasmine-console-reporter");
const fs = require("fs");
const path = require("path");

jas.loadConfig({
    spec_dir: "spec",
    spec_files: [
        "**/**.spec.js"
    ],
    helpers: [
        "helpers/**/*.js"
    ],
    random: false
});

const reporter = new JasmineConsoleReporter({
    colors: 1, // (0|false)|(1|true)|2
    cleanStack: 1, // (0|false)|(1|true)|2|3
    verbosity: 4, // (0|false)|1|2|(3|true)|4|Object
    listStyle: "indent", // "flat"|"indent"
    timeUnit: "ms", // "ms"|"ns"|"s"
    timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
    activity: false, // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
    emoji: true,
    beep: true
});
const SpecJSON = {
    failedSpecs: 0,
    passedSpecs: 0
};
var specReporter = {
    specDone: function(result) {
        SpecJSON.failedSpecs += result.failedExpectations.length;
        SpecJSON.passedSpecs += result.passedExpectations.length;
    }

};
jas.addReporter(reporter);
jas.addReporter(specReporter);
jas.env.configure({
    failFast: true
});
jas.onComplete(async function(passed) {
    fs.writeFileSync(
        path.resolve("./coverage/spec-summary.json"),
        JSON.stringify(SpecJSON, null, 2),
        "utf8"
    );
    if (passed) {
        console.log("passed");
        process.exit(0);
    } else {
        console.log("failed");
        process.exit(1);
    }
});

jas.execute();

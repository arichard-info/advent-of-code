"use strict";
var fs = require("fs");
module.exports = function (dayDirectory, action, solverFn) {
    var rawData;
    try {
        rawData = fs.readFileSync("".concat(dayDirectory, "/").concat(action, ".txt"), { encoding: 'utf8' });
    }
    catch (err) {
        console.error("No data file found, please create \"".concat(action, ".txt\""));
    }
    try {
        solverFn(rawData);
    }
    catch (err) {
        console.error("Unexpected error while trying to run the script");
    }
};

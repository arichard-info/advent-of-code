"use strict";
var glob = require('glob');
var getDirectoriesNames = function (pattern) {
    var directories = glob.sync(pattern);
    return directories.map(function (dirname) { return dirname.split("/").at(-1); }).sort(function (a, b) { return (+b - +a); });
};
module.exports = {
    getDirectoriesNames: getDirectoriesNames,
    YEAR_PATTERN: "[0-9][0-9][0-9][0-9]",
    DAY_PATTERN: "[0-9][0-9]"
};

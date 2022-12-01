#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var EOL = require('os').EOL;
var clear = require('clear');
var path = require('path');
var normalizePath = require('normalize-path');
var displayBanner = require('./banner');
var inquirer = require('./inquirer');
var solver = require('./solver');
var _a = require('./filesystem'), getDirectoriesNames = _a.getDirectoriesNames, YEAR_PATTERN = _a.YEAR_PATTERN, DAY_PATTERN = _a.DAY_PATTERN;
var rootDirectory = path.resolve(__dirname + "/../../../");
var workspaceDirectory = normalizePath(path.join(rootDirectory, "packages"));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var years, year, days, day, solverFn, action, shouldExit, hrstart, hrend;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, displayBanner()];
            case 1:
                _a.sent();
                years = getDirectoriesNames("".concat(workspaceDirectory, "/").concat(YEAR_PATTERN));
                return [4 /*yield*/, inquirer.getYear(years)];
            case 2:
                year = _a.sent();
                days = getDirectoriesNames("".concat(workspaceDirectory, "/").concat(year, "/").concat(DAY_PATTERN));
                return [4 /*yield*/, inquirer.getDay(days)];
            case 3:
                day = _a.sent();
                solverFn = require("".concat(workspaceDirectory, "/").concat(year, "/").concat(day, "/index.js"));
                _a.label = 4;
            case 4:
                if (!true) return [3 /*break*/, 6];
                shouldExit = false;
                return [4 /*yield*/, inquirer.getAction(action)];
            case 5:
                action = _a.sent();
                clear();
                switch (action) {
                    case inquirer.Action.EXIT: {
                        shouldExit = true;
                        break;
                    }
                    case inquirer.Action.EXAMPLE:
                    case inquirer.Action.DATA: {
                        hrstart = process.hrtime();
                        solver("".concat(workspaceDirectory, "/").concat(year, "/").concat(day), action, solverFn);
                        hrend = process.hrtime(hrstart);
                        console.info('🕒 Execution time : %ds %dms', hrend[0], hrend[1] / 1000000, EOL);
                        break;
                    }
                    default: break;
                }
                if (shouldExit)
                    return [3 /*break*/, 6];
                return [3 /*break*/, 4];
            case 6: return [2 /*return*/];
        }
    });
}); })();

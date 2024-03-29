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
var inquirer = require('inquirer');
var getYear = function (years) { return __awaiter(void 0, void 0, void 0, function () {
    var yearChoice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'Year',
                    type: 'list',
                    choices: years,
                })];
            case 1:
                yearChoice = _a.sent();
                return [2 /*return*/, yearChoice.Year];
        }
    });
}); };
var getDay = function (existingDays) { return __awaiter(void 0, void 0, void 0, function () {
    var yearChoice;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'Day',
                    type: 'list',
                    choices: Array.from(Array(25).keys()).map(function (i) {
                        var day = (i + 1).toString().padStart(2, '0');
                        var name = day;
                        if (existingDays.indexOf(day) === -1)
                            name = day + ' (create)';
                        return { name: name, value: day };
                    }),
                })];
            case 1:
                yearChoice = _a.sent();
                return [2 /*return*/, yearChoice.Day];
        }
    });
}); };
var Action;
(function (Action) {
    Action["EXAMPLE"] = "example";
    Action["DATA"] = "data";
    Action["EXIT"] = "exit";
    Action["BACK"] = "back";
})(Action || (Action = {}));
var getAction = function (defaultAction) {
    if (defaultAction === void 0) { defaultAction = Action.EXAMPLE; }
    return __awaiter(void 0, void 0, void 0, function () {
        var actionChoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt({
                        name: 'action',
                        message: 'Action',
                        default: defaultAction,
                        type: 'list',
                        choices: [
                            { name: 'Run with example data', value: Action.EXAMPLE },
                            { name: 'Run with real data', value: Action.DATA },
                            { name: '⬅️  Go back', value: Action.BACK },
                            { name: '🚪 Exit', value: Action.EXIT },
                        ],
                    })];
                case 1:
                    actionChoice = _a.sent();
                    return [2 /*return*/, actionChoice.action];
            }
        });
    });
};
module.exports = {
    getYear: getYear,
    getDay: getDay,
    getAction: getAction,
    Action: Action,
};

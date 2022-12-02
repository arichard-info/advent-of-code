#!/usr/bin/env node

const { EOL } = require('os');
const clear = require('clear');
const path = require('path');
const normalizePath = require('normalize-path');

const displayBanner = require('./banner');
const inquirer = require('./inquirer');
const solver = require('./solver');
const { getDirectoriesNames, requireSolver, YEAR_PATTERN, DAY_PATTERN } = require('./filesystem');

const rootDirectory = path.resolve(__dirname + "/../../../");
const workspaceDirectory = normalizePath(path.join(rootDirectory, "packages"));

(async () => {
    await displayBanner();

    const years = getDirectoriesNames(`${workspaceDirectory}/${YEAR_PATTERN}`);
    const year = await inquirer.getYear(years);

    const days = getDirectoriesNames(`${workspaceDirectory}/${year}/${DAY_PATTERN}`);
    const day = await inquirer.getDay(days);

    let action;

    while(true) {
        let shouldExit = false;
        action = await inquirer.getAction(action);
        const solverFn = await requireSolver(`${workspaceDirectory}/${year}/${day}`);
        clear();
        switch(action) {
            case inquirer.Action.EXIT: {
                shouldExit = true;
                break;
            }
            case inquirer.Action.EXAMPLE:
            case inquirer.Action.DATA: {
                const hrstart = process.hrtime();
                solver(`${workspaceDirectory}/${year}/${day}`, action, solverFn);
                const hrend = process.hrtime(hrstart);
                console.info('🕒 Execution time : %ds %dms', hrend[0], hrend[1] / 1000000, EOL)
                break;
            }
            default: break;
        }

        if (shouldExit) break;
    }
})()

export {}
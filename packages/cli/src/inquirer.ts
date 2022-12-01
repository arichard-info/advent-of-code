
const inquirer = require('inquirer');

const getYear = async (years: string[]): Promise<string> => {
    const yearChoice = await inquirer.prompt({
        name: "Year",
        type: "list", choices: years
    });
    return yearChoice.Year;
}

const getDay = async (days: string[]): Promise<string> => {
    const yearChoice = await inquirer.prompt({
        name: "Day",
        type: "list", choices: days
    });
    return yearChoice.Day;
}

enum Action {
    EXAMPLE = "example", 
    DATA = "data", 
    EXIT = "exit"
}

const getAction = async (defaultAction: Action = Action.EXAMPLE): Promise<Action> => {
    const actionChoice = await inquirer.prompt({
        name: "action",
        message: "Action",
        default: defaultAction,
        type: "list", choices: [
            { name: "Run with example data", value: Action.EXAMPLE },
            { name: "Run with real data", value: Action.DATA },
            { name: "Exit", value: Action.EXIT }
        ]
    });
    return actionChoice.action;
}


module.exports = {
    getYear,
    getDay,
    getAction,
    Action
}
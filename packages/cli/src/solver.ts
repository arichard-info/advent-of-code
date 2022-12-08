const fs = require('fs');

module.exports = (dayDirectory: string, action: Action, solverFn: Function) => {
    let rawData;
    try {
        rawData = fs.readFileSync(`${dayDirectory}/${action}.txt`, { encoding: 'utf8' });
    } catch (err) {
        console.error(`No data file found, please create "${action}.txt"`);
    }
    try {
        solverFn(rawData);
    } catch (err) {
        console.error(`Unexpected error while trying to run the script`, err);
    }
};

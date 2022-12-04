const { EOL } = require('os');

const parseData = (data: string): string => data;

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    console.log('1.');

    console.log('2.');
};

export {};

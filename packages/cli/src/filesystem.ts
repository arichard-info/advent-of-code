const glob = require('glob');
const importFresh = require('import-fresh');
const fs = require('fs');

const getDirectoriesNames = (pattern: string): string[] => {
    const directories = glob.sync(pattern);
    return directories
        .map((dirname: string): string | undefined => dirname.split('/').at(-1))
        .sort((a: string, b: string) => +b - +a);
};

const requireSolver = async (absolutePath: string) => {
    let module;
    try {
        module = await importFresh(`${absolutePath}/index.ts`);
    } catch (err) {
        module = await importFresh(`${absolutePath}/index.js`);
    }
    return module;
};

const scaffoldDay = async (
    directory: string,
    year: string,
    day: string,
    ts: boolean = true
): Promise<void> => {
    const dayDirectory = `${directory}/${year}/${day}`;
    await fs.promises.mkdir(dayDirectory);

    const extension = ts ? 'ts' : 'js';
    const template = await fs.promises.readFile(`${directory}/cli/src/templates/day.${extension}`);

    await fs.promises.writeFile(`${dayDirectory}/index.${extension}`, template);
    await fs.promises.writeFile(`${dayDirectory}/data.txt`, '');
    await fs.promises.writeFile(`${dayDirectory}/example.txt`, '');
};

module.exports = {
    getDirectoriesNames,
    requireSolver,
    scaffoldDay,
    YEAR_PATTERN: '[0-9][0-9][0-9][0-9]',
    DAY_PATTERN: '[0-9][0-9]',
};

export {};

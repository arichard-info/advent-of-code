const glob = require('glob');

const getDirectoriesNames = (pattern: string): string[] => {
    const directories = glob.sync(pattern);
    return directories.map((dirname: string): string | undefined => dirname.split("/").at(-1)).sort((a: string, b: string) => (+b - +a))
}

const requireSolver = async (absolutePath: string) => {
    let module;
    try {
        module = await require(`${absolutePath}/index.ts`);
    } catch(err) {
        module = await require(`${absolutePath}/index.js`);
    }
    return module;
}

module.exports = {
    getDirectoriesNames,
    requireSolver,
    YEAR_PATTERN: "[0-9][0-9][0-9][0-9]",
    DAY_PATTERN: "[0-9][0-9]"
}
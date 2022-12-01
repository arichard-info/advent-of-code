const glob = require('glob');

const getDirectoriesNames = (pattern: string): string[] => {
    const directories = glob.sync(pattern);
    return directories.map((dirname: string): string | undefined => dirname.split("/").at(-1)).sort((a: string, b: string) => (+b - +a))
}

module.exports = {
    getDirectoriesNames,
    YEAR_PATTERN: "[0-9][0-9][0-9][0-9]",
    DAY_PATTERN: "[0-9][0-9]"
}
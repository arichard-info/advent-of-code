const { EOL } = require('os');

const getDirectoryFromPath = (
    fileSystem: { [k: string]: any },
    pathSegments: string[]
): { [k: string]: any } => {
    let dir = fileSystem['/'];
    for (const segment of pathSegments) {
        dir = dir[segment];
    }
    return dir;
};

const addDirectory = (currentDir: { [k: string]: any }, newDir: string): { [k: string]: any } => {
    if (!currentDir[newDir]) {
        currentDir[newDir] = {};
    }

    return currentDir[newDir];
};

const getSumOfUnder10000 = (directory: { [k: string]: any }) => {
    let answer = 0;
    const getSumOfDirectories = (directory: { [k: string]: any }): number => {
        let size = 0;
        for (const [key, value] of Object.entries(directory)) {
            if (Number.isInteger(value)) {
                size += value;
            } else {
                size += getSumOfDirectories(directory[key]);
            }
        }

        if (size < 100000) {
            answer += size;
        }

        return size;
    };

    getSumOfDirectories(directory);

    return answer;
};

const getMinSpaceToRemove = (directory: { [k: string]: any }) => {
    const getSizes = (directory: { [k: string]: any }, sizes: number[]) => {
        let size = 0;
        for (const [key, value] of Object.entries(directory)) {
            if (Number.isInteger(value)) {
                size += value;
            } else {
                size += getSizes(directory[key], sizes);
            }
        }

        sizes.push(size);
        return size;
    };

    const sizes: number[] = [];
    const total = getSizes(directory['/'], sizes);
    const unused = 70000000 - total;
    const minDirSize = 30000000 - unused;
    return Math.min(...sizes.filter((s) => s > minDirSize));
};

const parseData = (data: string) => {
    const fileSystem: { [k: string]: any } = {
        '/': {},
    };
    let currentDir = fileSystem['/'];
    let absolutePath: string[] = [];

    data.split('$ ')
        .filter(Boolean)
        .forEach((instruction) => {
            const [command, ...rest] = instruction.split(EOL).filter(Boolean);
            if (command.includes('cd')) {
                const dest = command.split(' ')[1];
                if (dest === '/') {
                    absolutePath = [];
                    currentDir = fileSystem['/'];
                } else if (dest === '..') {
                    absolutePath.pop();
                    currentDir = getDirectoryFromPath(fileSystem, absolutePath);
                } else {
                    absolutePath.push(dest);
                    currentDir = addDirectory(currentDir, dest);
                }
            } else if (command === 'ls') {
                rest.forEach((line) => {
                    const [param1, param2] = line.split(' ');
                    if (param1 === 'dir') {
                        addDirectory(currentDir, param2);
                    } else {
                        currentDir[param2] = +param1;
                    }
                });
            }
        });

    return fileSystem;
};

module.exports = (rawData: string) => {
    const filesystem = parseData(rawData);

    console.log('1.', getSumOfUnder10000(filesystem));
    console.log('2.', getMinSpaceToRemove(filesystem));
};

export {};

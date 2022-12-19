const { EOL } = require('os');

interface Blueprint {
    id: number;
    ore: number;
    clay: number;
    obsidian: [number, number];
    geode: [number, number];
}

const parseData = (data: string): Blueprint[] =>
    data.split(EOL).map((blueprint) => {
        const bp = blueprint.match(/\d+/g) as string[];
        return {
            id: +bp[0],
            ore: +bp[1],
            clay: +bp[2],
            obsidian: [+bp[3], +bp[4]],
            geode: [+bp[5], +bp[6]],
        };
    });

const getBestBlueprintScore = (blueprint: Blueprint, time: number): number => {
    let maxRobots = {
        ore: Math.max(blueprint.ore, blueprint.clay, blueprint.obsidian[0], blueprint.geode[0]),
        clay: blueprint.obsidian[1],
    };

    let maxGeode = 0;
    const search = (
        time: number,
        oreRobots: number,
        clayRobots: number,
        obsidianRobots: number,
        ore: number,
        clay: number,
        obsidian: number,
        geodes: number
    ) => {
        if (time < 1) return;

        if (geodes + (time * (time + 1)) / 2 < maxGeode) {
            return;
        }
        if (geodes > maxGeode) {
            maxGeode = geodes;
        }

        //Build geode robot
        if (obsidianRobots > 0) {
            let canBuildGeodeNow = blueprint.geode[0] <= ore && blueprint.geode[1] <= obsidian;
            let timeSkip =
                1 +
                (canBuildGeodeNow
                    ? 0
                    : Math.max(
                          Math.ceil((blueprint.geode[0] - ore) / oreRobots),
                          Math.ceil((blueprint.geode[1] - obsidian) / obsidianRobots)
                      ));

            search(
                time - timeSkip,
                oreRobots,
                clayRobots,
                obsidianRobots,
                ore + timeSkip * oreRobots - blueprint.geode[0],
                clay + timeSkip * clayRobots,
                obsidian + timeSkip * obsidianRobots - blueprint.geode[1],
                geodes + time - timeSkip
            );

            if (canBuildGeodeNow) return;
        }

        //Build obsidian robot
        if (clayRobots > 0) {
            let canBuildObsidianNow = blueprint.obsidian[0] <= ore && blueprint.obsidian[1] <= clay;
            let timeSkip =
                1 +
                (canBuildObsidianNow
                    ? 0
                    : Math.max(
                          Math.ceil((blueprint.obsidian[0] - ore) / oreRobots),
                          Math.ceil((blueprint.obsidian[1] - clay) / clayRobots)
                      ));

            if (time - timeSkip > 2) {
                search(
                    time - timeSkip,
                    oreRobots,
                    clayRobots,
                    obsidianRobots + 1,
                    ore + timeSkip * oreRobots - blueprint.obsidian[0],
                    clay + timeSkip * clayRobots - blueprint.obsidian[1],
                    obsidian + timeSkip * obsidianRobots,
                    geodes
                );
            }
        }

        //Build clay robot
        if (clayRobots < maxRobots.clay) {
            let canBuildClayNow = blueprint.clay <= ore;
            let timeSkip = 1 + (canBuildClayNow ? 0 : Math.ceil((blueprint.clay - ore) / oreRobots)); //Todo maybe add one here

            if (time - timeSkip > 3) {
                search(
                    time - timeSkip,
                    oreRobots,
                    clayRobots + 1,
                    obsidianRobots,
                    ore + timeSkip * oreRobots - blueprint.clay,
                    clay + timeSkip * clayRobots,
                    obsidian + timeSkip * obsidianRobots,
                    geodes
                );
            }
        }

        //Build ore robot
        if (oreRobots < maxRobots.ore) {
            let canBuildOreNow = blueprint.ore <= ore;
            let timeSkip = 1 + (canBuildOreNow ? 0 : Math.ceil((blueprint.ore - ore) / oreRobots)); //Todo maybe add one here

            if (time - timeSkip > 4) {
                search(
                    time - timeSkip,
                    oreRobots + 1,
                    clayRobots,
                    obsidianRobots,
                    ore + timeSkip * oreRobots - blueprint.ore,
                    clay + timeSkip * clayRobots,
                    obsidian + timeSkip * obsidianRobots,
                    geodes
                );
            }
        }
    };

    search(time, 1, 0, 0, 0, 0, 0, 0);
    return maxGeode;
};

module.exports = (rawData: string) => {
    const blueprints = parseData(rawData);

    const qualityLevel = blueprints.reduce((count: number, blueprint: Blueprint): number => {
        return count + blueprint.id * getBestBlueprintScore(blueprint, 24);
    }, 0);

    console.log('1.', qualityLevel);

    let result = 1;
    for (let i = 0; i < 3; i++) result *= getBestBlueprintScore(blueprints[i], 32);

    console.log('2.', result);
};

export {};

const { EOL } = require('os');

type Race = {
    time: number;
    distance: number;
};

const parseData = (data: string): Race[] => {
    const races: Race[] = [];
    data.split(EOL).forEach((row, rowIndex) => {
        row.split(':')[1]
            .trim()
            .split(/\s+/)
            .forEach((value, index) => {
                if (!races[index]) {
                    races[index] = { time: -1, distance: -1 };
                }

                if (rowIndex === 0) {
                    races[index].time = +value;
                } else {
                    races[index].distance = +value;
                }
            });
    });
    return races;
};

module.exports = (rawData: string) => {
    const data = parseData(rawData);

    let res1 = 1;
    data.forEach((race) => {
        let wins = 0;
        for (let hold = 0; hold < race.time; hold++) {
            if ((race.time - hold) * hold > race.distance) wins++;
        }
        res1 = res1 * wins;
    });

    console.log('1.', res1);

    const singleRace: Race = {
        time: +data.map((race) => race.time).join(''),
        distance: +data.map((race) => race.distance).join(''),
    };

    let wins = 0;
    for (let hold = 0; hold < singleRace.time; hold++) {
        if ((singleRace.time - hold) * hold > singleRace.distance) wins++;
    }

    console.log('2.', wins);
};

export {};

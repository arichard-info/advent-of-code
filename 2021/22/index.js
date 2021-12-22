const { deepClone } = require('./../../utils')

const parseData = (data) => {
    return data.split('\n').map(row => {
        const [x, y, z] = row.match(/-?[0-9]+\.\.-?[0-9]+/gm);
        return {
            on: !!row.match(/^on/gm),
            x: x.split('..').map(Number),
            y: y.split('..').map(Number),
            z: z.split('..').map(Number)
        }
    })
}

const solve1 = (data) => {
    const records = deepClone(data).filter(r => Math.abs(r.x[0]) < 51 && Math.abs(r.x[1]) < 51 && Math.abs(r.y[0]) < 51 && Math.abs(r.y[1]) < 51 && Math.abs(r.z[0]) < 51 && Math.abs(r.z[1]) < 51)
    const save = [];
    records.forEach(r => {
        for (let x = r.x[0]; x <= r.x[1]; x++) {
            for (let y = r.y[0]; y <= r.y[1]; y++) {
                for (let z = r.z[0]; z <= r.z[1]; z++) {
                    if (r.on) save[[x, y, z]] = true;
                    else delete save[[x, y, z]];;
                }
            }
        }
    })
    return save;
}

const intersect = (recordA, recordB, on) => {
    if (recordA.x[0] > recordB.x[1] || recordA.x[1] < recordB.x[0] ||
        recordA.y[0] > recordB.y[1] || recordA.y[1] < recordB.y[0] ||
        recordA.z[0] > recordB.z[1] || recordA.z[1] < recordB.z[0]
    ) return null
    return {
        on,
        x: [Math.max(recordA.x[0], recordB.x[0]), Math.min(recordA.x[1], recordB.x[1])],
        y: [Math.max(recordA.y[0], recordB.y[0]), Math.min(recordA.y[1], recordB.y[1])],
        z: [Math.max(recordA.z[0], recordB.z[0]), Math.min(recordA.z[1], recordB.z[1])]
    }
}

const solve2 = (data) => {
    const records = deepClone(data);
    let resultRecords = [];
    records.forEach((record) => {
        const newRecords = []
        if (record.on) newRecords.push(record);
        resultRecords.forEach(resultRecord => {
            const intersection = intersect(record, resultRecord, !resultRecord.on)
            if (intersection) newRecords.push(intersection)
        })
        resultRecords = resultRecords.concat(newRecords);
    })
    return resultRecords.reduce((total, record) => {
        const number = (record.x[1] - record.x[0] + 1) * (record.y[1] - record.y[0] + 1) * (record.z[1] - record.z[0] + 1)
        return total + number * (record.on ? 1 : -1);
    }, 0);
}

module.exports = (rawData) => {
    const data = parseData(rawData);
    const res1 = solve1(data);
    console.log('1.', Object.values(res1).length)

    const res2 = solve2(data);
    console.log('2.', res2)
}
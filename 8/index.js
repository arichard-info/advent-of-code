const fs = require("fs");
const path = require("path");

const getData = (parser) => {
    const pathname = path.resolve(__dirname)
    return parser(fs.readFileSync(`${pathname}/data.txt`).toString());
}

const parseData = (str) => {
    return str.split('\n').map(row => {
        const digits = row.split(' | ')[0].split(' ').map(str => str.split('').sort().join(''));
        return {
            records: row.split(' | ')[1].split(' ').map(str => str.split('').sort().join('')),
            mapping: decodeDigits(digits)
        }
    });
}

const countDigits = (rows) => {
    const lengths = [2, 4, 3, 7];
    return rows.reduce((count, row) => count + row.records.filter(r => lengths.includes(r.length)).length, 0)
}

const includesChars = (base, test) => test.split('').every(c => base.includes(c));

const decodeDigits = (digits) => {
    const mapping = {};
    digits = digits.filter(d => {
        if (d.length === 2) mapping['1'] = d;
        if (d.length === 4) mapping['4'] = d;
        if (d.length === 3) mapping['7'] = d;
        if (d.length === 7) mapping['8'] = d;
        return ![2, 4, 3, 7].includes(d.length)
    })

    digits = digits.filter(d => {
        if (d.length === 6 && includesChars(d, mapping['4'])) { mapping['9'] = d; return false }
        if (d.length === 5 && includesChars(d, mapping['7'])) { mapping['3'] = d; return false }
        if (d.length === 6 && includesChars(d, mapping['7'])) { mapping['0'] = d; return false }
        return true;
    });

    digits = digits.filter(d => {
        if (d.length === 6) { mapping['6'] = d; return false; };
        return true
    })

    const remainingSix = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].find(c => !mapping['6'].includes(c));
    digits.forEach(d => {
        if (d.includes(remainingSix)) mapping['2'] = d
        else mapping['5'] = d
    })

    return mapping
}

const objectFlip = (obj) => {
    const ret = {};
    Object.keys(obj).forEach(key => {
      ret[obj[key]] = key;
    });
    return ret;
  }

const decodeRecords = (records, mapping) => {
    const revertMapping = objectFlip(mapping);
    return records.reduce((str, record) => `${str}${revertMapping[record]}`, '')
}

(() => {
    const rows = getData(parseData);
    const count = countDigits(rows);

    console.log('1.', count);

    const decodedRows = rows.map(row => decodeRecords(row.records, row.mapping))
    const total = decodedRows.reduce((count, value) => count + Number(value), 0)

    console.log('2.', total)
})();
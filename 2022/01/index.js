const parseData = (data) => data.split('\n\n').map(elfArray => elfArray.split('\n').map(value => +value));

module.exports = (rawData) => {
    const data = parseData(rawData)

    const res1 = Math.max(...data.map(elf => elf.reduce((acc, value) => acc + value)))
    console.log('1.', res1)


    const sortedElves = data.map(elf => elf.reduce((acc, value) => acc + value)).sort((a, b) => ( b - a )).slice(0,3);

    console.log('2.', sortedElves.reduce((acc, value) => acc + value))
}

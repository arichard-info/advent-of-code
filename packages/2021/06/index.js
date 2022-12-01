const parseData = (rawData) => rawData.split(',').map(Number)

const getFishes = (fishes, days, prefix) => {
    for(let i = 0; i <days; i++) {
        const newFishes = [];
        const updatedFishes = fishes.map(fish => { 
            if(fish === 0) {
                newFishes.push(8);
                return 6;
            }
            return fish -1;
        });
        fishes = [...updatedFishes, ...newFishes];
    }
    return fishes;
}

const hashes = {}
const afterDays = (start, days) => {
  const hash = `${start}_${days}`
  if (!hashes[hash]) {
    let count = 1 // itself
    let nextReproduction = days - start
    while (nextReproduction > 0) {
      count += afterDays(8, nextReproduction - 1)
      nextReproduction -= 7
    }
    hashes[hash] = count
  }
  return hashes[hash]
}

const getFishesRecursive = (fishes, days) => {
    let count = 0;
    fishes.forEach(fish => {
        count += afterDays(fish, days)
      })
    return count
}

module.exports = (rawData) => {
  const data = parseData(rawData);

  const fishes = getFishes(data, 80)
  console.log('1.', fishes.length)

  const fishes2 = getFishesRecursive(data, 256);
  console.log("2.", fishes2);
}
const print2dArray = (array) => {
    console.log(array.map(row => row.join('')).join('\n'))
}

module.exports = {
    print2dArray
}
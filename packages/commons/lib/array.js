const { EOL } = require('os');

const print2dArray = (array) => {
    console.log(array.map(row => row.join('')).join(EOL))
}

module.exports = {
    print2dArray
}
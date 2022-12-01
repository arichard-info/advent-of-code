const clear = require('clear');
const figlet = require('figlet');

module.exports = async () => {
    clear();
    console.log(
        figlet.textSync('advent-of-code', { horizontalLayout: 'full' })
    );
}

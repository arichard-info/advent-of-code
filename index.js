const fs = require('fs');
const path = require('path');

const getDataString = (filepath) => {
    const pathname = path.resolve(__dirname)
    return fs.readFileSync(`${pathname}/${filepath}`).toString();
}

const args = process.argv.slice(2);

if (args.length < 1) {
	console.log('Useage: node ' + path.basename(__filename) + ' <year/day> [part] [-f input]');
	return;
}

[year, day] = args.shift().split('/');
if (day.length < 2) day = '0' + day;

const daypath = `./${year}/${day}`

solve = require(daypath);
let data;
if (args.length > 1 && args[0] === '-f') data = getDataString(`${daypath}/${args[1]}`);
else data = getDataString(`${daypath}/data.txt`);

solve(data);
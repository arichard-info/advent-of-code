const parseData = (data) => {
	const raws = data.split(/\r/).join("").split("\n");
	const octopuses = data.split(/\r/).join("").split("\n").join("").split("").map(Number);
	return {
		octopusesPerRow: raws[0].length,
		octopuses
	}
}

const countFlashes = (octopuses, octupusesPerRow, daysToCount) => {
	let firstSyncFlash;
	let flashesCount = 0;
	let day = 1;

	while (!firstSyncFlash || day <= daysToCount) {
		let flashed = [];
		for (let j = 0; j < octopuses.length; j++) octopuses[j] += 1;
		let flash = octopuses.findIndex(i => i > 9);

		while (flash > -1) {
			if (flashed.includes(flash)) {
				octopuses[flash] = 0;
				flash = octopuses.findIndex(i => i > 9);
				continue;
			}
			const neighbours = [
				flash - octupusesPerRow,
				flash + octupusesPerRow
			];
			if (flash % octupusesPerRow != 0) neighbours.push(flash - octupusesPerRow - 1, flash - 1, flash + octupusesPerRow - 1);
			if (flash % octupusesPerRow != octupusesPerRow - 1) neighbours.push(flash - octupusesPerRow + 1, flash + 1, flash + octupusesPerRow + 1);
			for (const neighbour of neighbours) {
				if (neighbour < 0 || neighbour >= octopuses.length) continue;
				octopuses[neighbour] += 1;
			};
			flashed.push(flash);
			if (day <= daysToCount) flashesCount += 1;
			flash = octopuses.findIndex(i => i > 9);
		}

		for (const i of flashed) octopuses[i] = 0;
		if (flashed.length === octopuses.length) firstSyncFlash = day;
		day += 1;
	}
    return { firstSyncFlash, flashesCount };
}

module.exports = (rawData) => {
	const { octopusesPerRow, octopuses } = parseData(rawData);
	const { firstSyncFlash, flashesCount } = countFlashes(octopuses, octopusesPerRow, 100);
	console.log('1.', flashesCount)
	console.log('2.', firstSyncFlash)
}
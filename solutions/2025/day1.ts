import { readInputFile } from "#/utilities/general";

let data = readInputFile(2025, 1)
	.toString()
	.split("\n")
	.map((row) => ({
		direction: row.charAt(0) === "R" ? 1 : -1,
		value: +row.substring(1)
	}));

let dial = 50;
let zeroStopCount = 0;
let zeroMoveCount = 0;
for (const rotation of data) {
	for (let i = 0; i < rotation.value; i++) {
		dial = (dial + rotation.direction + 100) % 100;
		if (!dial) {
			zeroMoveCount++;
		}
	}
	if (!dial) {
		zeroStopCount++;
	}
}

console.log("Part 1: ", zeroStopCount);
console.log("Part 2: ", zeroMoveCount);

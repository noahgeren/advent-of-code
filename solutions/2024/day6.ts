// import {BigNumber} from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 6)
	.toString()
	.split("\n")
	.map((line) => line.split(""));

const guardStartingPosition: { x: number; y: number } = { x: -1, y: -1 };
parseDataOuterLoop: for (let y = 0; y < data.length; y++) {
	for (let x = 0; x < data[y].length; x++) {
		if (data[y][x] === "^") {
			guardStartingPosition.x = x;
			guardStartingPosition.y = y;
			break parseDataOuterLoop;
		}
	}
}
const DIRECTIONS = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0]
];

const runGuardSimulation = () => {
	let guard = { ...guardStartingPosition, direction: 0 };
	let seen = new Set<number>();
	let loop = false;
	let hash = 0;
	while (
		guard.y >= 0 &&
		guard.y < data.length &&
		guard.x >= 0 &&
		guard.x < data[0].length &&
		!(loop = seen.has(
			(hash =
				guard.y * data[0].length * 4 + guard.x * 4 + guard.direction)
		))
	) {
		seen.add(hash);
		let newPos = { ...guard };
		newPos.x += DIRECTIONS[guard.direction][0];
		newPos.y += DIRECTIONS[guard.direction][1];
		if (data[newPos.y]?.[newPos.x] === "#") {
			guard.direction = (guard.direction + 1) % 4;
		} else {
			guard = newPos;
		}
	}
	return {
		loop,
		seen
	};
};

const unchanged = runGuardSimulation();
const distinctCells = new Set(
	[...unchanged.seen].map((hash) => Math.floor(hash / 4))
);

console.log(distinctCells.size);

let count = 0;
distinctCells.forEach((hash) => {
	let x = hash % data[0].length;
	let y = Math.floor(hash / data[0].length);
	if (data[y][x] === ".") {
		data[y][x] = "#";
		if (runGuardSimulation().loop) {
			count++;
		}
		data[y][x] = ".";
	}
});

console.log(count);

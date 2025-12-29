// import { BigNumber } from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 4)
	.toString()
	.split("\n")
	.map((row) => row.split(""));

const letters = "XMAS".split("");
const checkIfWord = (x: number, y: number): number => {
	let count = 0;
	for (let xDir = -1; xDir <= 1; xDir++) {
		outer: for (let yDir = -1; yDir <= 1; yDir++) {
			if (xDir === 0 && yDir === 0) {
				continue;
			}
			for (let i = 1; i < letters.length; i++) {
				let row = data[y + yDir * i];
				if (!row || row[x + xDir * i] !== letters[i]) {
					continue outer;
				}
			}
			count++;
		}
	}
	return count;
};

let count = 0;
data.forEach((row, y) => {
	row.forEach((letter, x) => {
		if (letter === "X") {
			count += checkIfWord(x, y);
		}
	});
});

console.log(count);

const checkIfCross = (x: number, y: number) => {
	const upperLeft = data[y - 1]?.[x - 1],
		upperRight = data[y - 1]?.[x + 1],
		bottomLeft = data[y + 1]?.[x - 1],
		bottomRight = data[y + 1]?.[x + 1];

	return (
		((upperLeft === "M" && bottomRight === "S") ||
			(upperLeft === "S" && bottomRight === "M")) &&
		((upperRight === "M" && bottomLeft === "S") ||
			(upperRight === "S" && bottomLeft === "M"))
	);
};

count = 0;
data.forEach((row, y) => {
	row.forEach((letter, x) => {
		if (letter === "A" && checkIfCross(x, y)) {
			count++;
		}
	});
});

console.log(count);

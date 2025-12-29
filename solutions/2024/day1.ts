import { ZERO } from "#/utilities/constants";
import { readInputFile } from "#/utilities/general";

let data = readInputFile(2024, 1)
	.toString()
	.split("\n")
	.map((row) => row.split(/\s+/).map((n) => +n));

data.pop();

let leftSide = data.map((row) => row[0]).sort();
let rightSide = data.map((row) => row[1]).sort();

let diffSum = ZERO;
for (let i = 0; i < leftSide.length; i++) {
	diffSum = diffSum.plus(Math.abs(leftSide[i] - rightSide[i]));
}

console.log(diffSum.toFixed());

console.log(
	rightSide
		.filter((n) => leftSide.includes(n))
		.reduce((a, b) => a.plus(b), ZERO)
		.toFixed()
);

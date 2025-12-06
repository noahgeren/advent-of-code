import BigNumber from "bignumber.js";
import { readFileSync } from "node:fs";

const values = readFileSync("./data/2025/day6.txt").toString().split("\n");
const ops = values.splice(values.length - 1, 1)[0];

const maxLength = values.reduce<number>((max, row) => {
	return Math.max(max, row.length);
}, 0);

let horizontalGrandTotal = BigNumber(0);
let verticalGrandTotal = BigNumber(0);

let index = 0;
while (index < ops.length) {
	const multiply = ops.charAt(index) === "*";
	let nextIndex = ops
		.split("")
		.findIndex((op, idx) => idx > index && (op === "*" || op === "+"));
	if (nextIndex < 0) {
		nextIndex = maxLength;
	}

	// Part 1
	horizontalGrandTotal = horizontalGrandTotal.plus(
		values.reduce<BigNumber>(
			(total, row) => {
				const value = BigNumber(row.slice(index, nextIndex).trim());
				if (multiply) {
					return total.times(value);
				}
				return total.plus(value);
			},
			BigNumber(multiply ? 1 : 0)
		)
	);

	// Part 2
	let columnValues: BigNumber[] = [
		...Array<BigNumber>(nextIndex - index)
	].fill(BigNumber(0));
	for (let i = index; i < nextIndex; i++) {
		for (let rowIndex = 0; rowIndex < values.length; rowIndex++) {
			if (values[rowIndex].charAt(i) === " ") {
				continue;
			}
			columnValues[i - index] = columnValues[i - index]
				.times(10)
				.plus(+values[rowIndex].charAt(i));
		}
	}

	if (columnValues[columnValues.length - 1].comparedTo(0) === 0) {
		columnValues.pop();
	}

	verticalGrandTotal = verticalGrandTotal.plus(
		columnValues.reduce(
			(total, value) => {
				if (multiply) {
					return total.times(value);
				}
				return total.plus(value);
			},
			BigNumber(multiply ? 1 : 0)
		)
	);

	index = nextIndex;
}

console.log("Part 1:", horizontalGrandTotal);
console.log("Part 2:", verticalGrandTotal);

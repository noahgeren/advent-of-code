// import { BigNumber } from "bignumber.js";
import { readInputFile } from "#/utilities/general";

let data = readInputFile(2024, 2)
	.toString()
	.split("\n")
	.map((row) => row.split(" ").map((n) => +n));

const isRowValid = (row: number[]) => {
	let last: number | undefined;
	let decreasing: boolean | undefined;
	return row.every((n) => {
		if (last !== undefined) {
			let diff = last - n;
			if (decreasing === undefined) {
				decreasing = diff > 0;
			} else if ((decreasing && diff < 0) || (!decreasing && diff > 0)) {
				return false;
			}
			diff = Math.abs(diff);
			if (diff < 1 || diff > 3) {
				return false;
			}
		}
		last = n;
		return true;
	});
};

console.log(data.filter((row) => isRowValid(row)).length);
console.log(
	data.filter((row) => {
		if (isRowValid(row)) return true;
		for (let i = 0; i < row.length; i++) {
			let newRow = [...row];
			newRow.splice(i, 1);
			if (isRowValid(newRow)) return true;
		}
		return false;
	}).length
);

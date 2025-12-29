import { ZERO } from "#/utilities/constants";
import { BigNumber } from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 7)
	.toString()
	.split("\n")
	.map((row) => {
		let tokens = row.split(":");
		return [
			BigNumber(tokens[0]),
			tokens[1]
				.trim()
				.split(" ")
				.map((n) => BigNumber(n))
		] as const;
	});

let modifiers: ((a: BigNumber, b: BigNumber) => BigNumber)[] = [
	(a, b) => a.plus(b),
	(a, b) => a.times(b)
];

const canCalculate = (expected: BigNumber, values: BigNumber[]): boolean => {
	if (values.length === 1) {
		return expected.comparedTo(values[0]) === 0;
	}
	const tail = values.slice(2);
	for (let mod of modifiers) {
		const head = mod(values[0], values[1]);
		if (
			head.comparedTo(expected) <= 0 &&
			canCalculate(expected, [head, ...tail])
		) {
			return true;
		}
	}
	return false;
};

const getSum = () =>
	data
		.filter((row) => canCalculate(row[0], row[1]))
		.reduce((a, b) => a.plus(b[0]), ZERO);

console.log(getSum().toFixed());

modifiers.push((a, b) => BigNumber(a.toFixed() + b.toFixed()));

console.log(getSum().toFixed());

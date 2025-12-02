import BigNumber from "bignumber.js";
import { readFileSync } from "node:fs";

const ranges = readFileSync("./data/2025/day2.txt")
	.toString()
	.split(",")
	.map(
		(range) =>
			range.split("-").map((value) => BigNumber(value)) as [
				BigNumber,
				BigNumber
			]
	);

const repeatPrefix = (prefix: number, count = 2): BigNumber => {
	return BigNumber(`${prefix}`.repeat(count));
};
const getStartingPrefix = (start: BigNumber): number => {
	const length = start.toString().length;
	if (length % 2 === 0) {
		const prefix = +start.toString().substring(0, length / 2);
		if (repeatPrefix(prefix).comparedTo(start) < 0) {
			return prefix + 1;
		}
		return prefix;
	}
	return Math.pow(10, Math.floor(length / 2));
};
const partOneAnswer = ranges.reduce<BigNumber>((currentSum, [start, end]) => {
	for (
		let prefix = getStartingPrefix(start);
		repeatPrefix(prefix).comparedTo(end) <= 0;
		prefix++
	) {
		currentSum = currentSum.plus(repeatPrefix(prefix));
	}
	return currentSum;
}, BigNumber(0));

console.log("Part 1:", partOneAnswer);

const maxValue = ranges
	.map((range) => range[1])
	.reduce((max, val) => {
		if (max.comparedTo(val) < 0) {
			return val;
		}
		return max;
	}, BigNumber(0));
const maxCount = maxValue.toString().length;
const maxPrefix = +maxValue.toString().substring(0, Math.floor(maxCount / 2));
const seenPrefixes: Record<number, boolean> = {};

let partTwoAnswer = BigNumber(0);
for (let prefix = 1; prefix <= maxPrefix; prefix++) {
	if (seenPrefixes[prefix]) {
		continue;
	}
	for (let count = 2; count <= maxCount; count++) {
		const invalidId = repeatPrefix(prefix, count);
		if (invalidId.comparedTo(maxValue) > 0) {
			break;
		}
		if (invalidId.comparedTo(maxPrefix) <= 0) {
			seenPrefixes[invalidId.toNumber()] = true;
		}
		if (
			ranges.some(
				([start, end]) =>
					invalidId.comparedTo(start) >= 0 &&
					invalidId.comparedTo(end) <= 0
			)
		) {
			partTwoAnswer = partTwoAnswer.plus(invalidId);
		}
	}
}

console.log("Part 2:", partTwoAnswer);

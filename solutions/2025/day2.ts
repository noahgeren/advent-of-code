import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const ranges = readInputFile(2025, 2)
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

let partOneAnswer = BigNumber(0);
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
			if (count % 2 === 0) {
				partOneAnswer = partOneAnswer.plus(invalidId);
			}
			partTwoAnswer = partTwoAnswer.plus(invalidId);
		}
	}
}

console.log("Part 1:", partOneAnswer);
console.log("Part 2:", partTwoAnswer);

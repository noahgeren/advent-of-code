import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2025, 5).toString().split("\n\n");
const freshIdRanges = data[0]
	.split("\n")
	.map(
		(range) =>
			range.split("-").map((idx) => BigNumber(idx)) as [
				BigNumber,
				BigNumber
			]
	);
const availableIds = data[1].split("\n").map((idx) => BigNumber(idx));

const availableAndFreshCount = availableIds.reduce<BigNumber>(
	(freshTotal, id) => {
		if (
			freshIdRanges.some(
				([start, end]) =>
					start.comparedTo(id) <= 0 && end.comparedTo(id) >= 0
			)
		) {
			return freshTotal.plus(1);
		}
		return freshTotal;
	},
	BigNumber(0)
);

console.log("Part 1:", availableAndFreshCount);

const calculateCombinedOverlap = (
	a: [BigNumber, BigNumber],
	b: [BigNumber, BigNumber]
): [BigNumber, BigNumber] => {
	const min = a[0].comparedTo(b[0]) <= 0 ? a[0] : b[0];
	const max = a[1].comparedTo(b[1]) >= 0 ? a[1] : b[1];
	return [min, max];
};

const isOverlapping = (
	[start, end]: [BigNumber, BigNumber],
	[otherStart, otherEnd]: [BigNumber, BigNumber]
): boolean =>
	(start.comparedTo(otherStart) <= 0 && end.comparedTo(otherStart) >= 0) ||
	(start.comparedTo(otherEnd) <= 0 && end.comparedTo(otherEnd) >= 0);

const combineOverlaps = (
	ranges: [BigNumber, BigNumber][]
): [BigNumber, BigNumber][] => {
	for (let i = 0; i < ranges.length; i++) {
		const range = ranges[i];
		const overlapIndex = ranges.findIndex(
			(otherRange, idx) =>
				idx > i &&
				(isOverlapping(range, otherRange) ||
					isOverlapping(otherRange, range))
		);
		if (overlapIndex === -1) {
			continue;
		}
		const newRange = calculateCombinedOverlap(range, ranges[overlapIndex]);

		ranges.splice(i, 1, newRange);
		ranges.splice(overlapIndex, 1);
		return combineOverlaps(ranges);
	}
	return ranges;
};

const totalFreshCount = combineOverlaps(freshIdRanges).reduce<BigNumber>(
	(total, range) => {
		return total.plus(range[1].minus(range[0]).plus(1));
	},
	BigNumber(0)
);

console.log("Part 2:", totalFreshCount);

import { ONE, ZERO } from "#/utilities/constants";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

let stones = readInputFile(2024, 11)
	.toString()
	.split(" ")
	.map((n) => new BigNumber(n));

const YEAR = BigNumber(2024);

const memory: Partial<Record<string, BigNumber>> = {};
const findLength = (n: BigNumber, blinksLeft: number): BigNumber => {
	if (blinksLeft === 0) {
		return ONE;
	}
	const nStr = n.toFixed();
	const hash = nStr + ("-" + blinksLeft--);
	if (memory[hash] !== undefined) {
		return memory[hash];
	}
	let result = ONE;
	if (n.isEqualTo(ZERO)) {
		result = findLength(ONE, blinksLeft);
	} else if (nStr.length % 2 === 0) {
		result = findLength(
			BigNumber(nStr.substring(0, nStr.length / 2)),
			blinksLeft
		).plus(
			findLength(BigNumber(nStr.substring(nStr.length / 2)), blinksLeft)
		);
	} else {
		result = findLength(n.times(YEAR), blinksLeft);
	}
	memory[hash] = result;
	return result;
};

console.log(stones.reduce((a, b) => a.plus(findLength(b, 25)), ZERO).toFixed());
console.log(stones.reduce((a, b) => a.plus(findLength(b, 75)), ZERO).toFixed());

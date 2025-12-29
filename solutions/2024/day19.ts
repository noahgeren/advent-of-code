import { ONE, ZERO } from "#/utilities/constants";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const patternsWanted = readInputFile(2024, 19)
	.toString()
	.split("\n")
	.filter((str) => str.trim().length);
const availableTowels = patternsWanted.shift()!.split(", ");

const patternMemory = new Map<string, BigNumber>();
const waysToMakePattern = (pattern: string): BigNumber => {
	if (!pattern.length) return ONE;
	if (patternMemory.has(pattern)) {
		return patternMemory.get(pattern)!;
	}
	let waysToMake = ZERO;
	for (const towel of availableTowels) {
		if (pattern.startsWith(towel)) {
			waysToMake = waysToMake.plus(
				waysToMakePattern(pattern.substring(towel.length))
			);
		}
	}
	patternMemory.set(pattern, waysToMake);
	return waysToMake;
};

const patternCounts = patternsWanted.map(waysToMakePattern);

console.log(patternCounts.filter((n) => !n.isZero()).length);
console.log(patternCounts.reduce((a, b) => a.plus(b), ZERO));

import { TWO, ZERO } from "#/utilities/constants";
import { bitwiseXOR } from "#/utilities/general";
import HashMap from "#/utilities/structures/HashMap";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const ITERATIONS = 2000;
const MODULUS = BigNumber("16777216");
const TEN = BigNumber(10);
const THIRTY_TWO = TWO.pow(5);
const SIXTY_FOUR = TWO.pow(6);
const TWO_KIBI = TWO.pow(11);
const secretNumbers = readInputFile(2024, 22)
	.toString()
	.split("\n")
	.map((n) => BigNumber(n));

type PatternKey = [number, number, number, number];

const patternHashFn = (key: PatternKey) => {
	let hash = 0;
	hash = hash * 20 + key[0];
	hash = hash * 20 + key[1];
	hash = hash * 20 + key[2];
	hash = hash * 20 + key[3];
	return hash;
};

const patternTotals = new HashMap<PatternKey, number>(patternHashFn);

const finalNumbers = secretNumbers.map((secret, idx) => {
	const pattern: number[] = [];
	let previousPrice = secret.mod(TEN).toNumber();
	const patternMaxes = new HashMap<PatternKey, number>(patternHashFn);
	for (let i = 0; i < ITERATIONS; i++) {
		secret = bitwiseXOR(secret, secret.times(SIXTY_FOUR)).mod(MODULUS);
		secret = bitwiseXOR(secret, secret.dividedToIntegerBy(THIRTY_TWO)).mod(
			MODULUS
		);
		secret = bitwiseXOR(secret, secret.times(TWO_KIBI)).mod(MODULUS);
		const currentPrice = secret.mod(TEN).toNumber();
		pattern.push(currentPrice - previousPrice);
		previousPrice = currentPrice;
		if (pattern.length === 4) {
			if (!patternMaxes.has(pattern as PatternKey)) {
				patternMaxes.set([...pattern] as PatternKey, currentPrice);
			}
			pattern.shift();
		}
	}
	patternMaxes.forEach((maxPrice, pattern) => {
		const currentTotal = patternTotals.get(pattern) ?? 0;
		patternTotals.set([...pattern], currentTotal + maxPrice);
	});
	return secret;
});

console.log(finalNumbers.reduce((a, b) => a.plus(b), ZERO));

console.log(Math.max(...patternTotals.values()));

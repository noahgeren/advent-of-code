import BigNumber from "bignumber.js";
import { readFileSync } from "node:fs";
import PromptSync from "prompt-sync";

export const prompt = PromptSync();
export const pause = (): boolean => {
	return prompt("press enter to continue: ") === "exit";
};
export const clear = (): void => {
	process.stdout.write("\x1Bc");
};

export const bitwiseXOR = (a: BigNumber, b: BigNumber) => {
	let aBinary = a.toString(2),
		bBinary = b.toString(2);
	if (aBinary.length > bBinary.length) {
		// pad b
		bBinary =
			Array(aBinary.length - bBinary.length)
				.fill("0")
				.join("") + bBinary;
	} else {
		// pad a
		aBinary =
			Array(bBinary.length - aBinary.length)
				.fill("0")
				.join("") + aBinary;
	}
	const xorBinary: number[] = [];
	for (let i = 0; i < aBinary.length; i++) {
		xorBinary.push(+aBinary[i] ^ +bBinary[i]);
	}
	return BigNumber(xorBinary.join(""), 2);
};

export const intersection = <T>(xs?: T[], ys?: T[], ...rest: T[][]): T[] =>
	xs === undefined
		? []
		: ys === undefined
			? xs
			: intersection(
					xs.filter((x) => ys.some((y) => y === x)),
					...rest
				);

export const readInputFile = (year: number, day: number) =>
	readFileSync(`./data/${year}/day${day}.txt`).toString();

export const gcd = (...values: (number | BigNumber)[]): BigNumber => {
	if (values.length === 1) {
		return BigNumber(values[0]);
	}
	if (values.length === 2) {
		if (BigNumber(values[1]).isZero()) {
			return BigNumber(values[0]);
		}
		return gcd(values[1], BigNumber(values[0]).mod(values[1]));
	}
	return values.reduce<BigNumber>(
		(currentGcd, value) => gcd(currentGcd, value),
		BigNumber(values[0])
	);
};

export const lcm = (...values: (number | BigNumber)[]): BigNumber => {
	if (values.length === 1) {
		return BigNumber(values[0]);
	}
	if (values.length === 2) {
		return BigNumber(values[0])
			.times(values[1])
			.div(gcd(values[0], values[1]));
	}
	return values.reduce<BigNumber>(
		(currentLcm, value) => lcm(currentLcm, value),
		BigNumber(1)
	);
};

// TODO:
//  - Helper function to sum values in array
//  - Update number based helpers to work with BigNumber

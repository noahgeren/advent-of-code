import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const banks = readInputFile(2025, 3)
	.toString()
	.split("\n")
	.map((row) =>
		row
			.trim()
			.split("")
			.map((val) => +val)
	);

const findMaxDigit = (
	bank: number[],
	digitsLeft: number
): { digit: number; index: number } => {
	let digit = Math.max(...bank.slice(0, bank.length - digitsLeft + 1));
	return {
		digit,
		index: bank.indexOf(digit)
	};
};

const findBankJoltage = (bank: number[], digits: number): BigNumber => {
	if (!digits) {
		return BigNumber(0);
	}
	const maxDigit = findMaxDigit(bank, digits);
	return BigNumber(10)
		.pow(digits - 1)
		.times(maxDigit.digit)
		.plus(findBankJoltage(bank.slice(maxDigit.index + 1), digits - 1));
};

console.log(
	"Part 1:",
	banks.reduce<BigNumber>((total, bank) => {
		return total.plus(findBankJoltage(bank, 2));
	}, BigNumber(0))
);

console.log(
	"Part 2:",
	banks.reduce<BigNumber>((total, bank) => {
		return total.plus(findBankJoltage(bank, 12));
	}, BigNumber(0))
);

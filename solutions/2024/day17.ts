import { ONE, TWO, ZERO } from "#/utilities/constants";
import { bitwiseXOR } from "#/utilities/general";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 17).toString().split("\n");

const EIGHT = TWO.pow(3);
const registers = {
	A: BigNumber(data[0].split(": ")[1]),
	B: BigNumber(data[1].split(": ")[1]),
	C: BigNumber(data[2].split(": ")[1])
};
const program = data[4]
	.split(": ")[1]
	.split(",")
	.map((n) => +n);
let instructionPointer = 0;
const output: BigNumber[] = [];

const getComboOperand = (): BigNumber => {
	const operand = program[instructionPointer + 1];
	if (operand <= 3) {
		return BigNumber(operand);
	}
	switch (operand) {
		case 4:
			return registers.A;
		case 5:
			return registers.B;
		case 6:
			return registers.C;
	}
	return ZERO;
};

const instructions: Record<number, () => void> = {
	0: () => {
		// A = floor(A / 2**combo)
		registers.A = registers.A.dividedToIntegerBy(
			TWO.pow(getComboOperand())
		);
		instructionPointer += 2;
	},
	1: () => {
		// B = B xor literal
		registers.B = bitwiseXOR(
			registers.B,
			BigNumber(program[instructionPointer + 1])
		);
		instructionPointer += 2;
	},
	2: () => {
		// B = combo mod 8
		registers.B = getComboOperand().mod(EIGHT);
		instructionPointer += 2;
	},
	3: () => {
		// if A != 0 -> jump to literal
		if (registers.A.isZero()) {
			instructionPointer += 2;
		} else {
			instructionPointer = program[instructionPointer + 1];
		}
	},
	4: () => {
		// B = B xor C
		registers.B = bitwiseXOR(registers.B, registers.C);
		instructionPointer += 2;
	},
	5: () => {
		// output += combo mod 8
		output.push(getComboOperand().mod(EIGHT));
		instructionPointer += 2;
	},
	6: () => {
		// B = floor(A / 2**combo)
		registers.B = registers.A.dividedToIntegerBy(
			TWO.pow(getComboOperand())
		);
		instructionPointer += 2;
	},
	7: () => {
		// C = floor(A / 2**combo)
		registers.C = registers.A.dividedToIntegerBy(
			TWO.pow(getComboOperand())
		);
		instructionPointer += 2;
	}
};

while (true) {
	if (instructionPointer >= program.length) {
		console.log(output.map((n) => n.toFixed()).join(","));
		break;
	}
	instructions[program[instructionPointer]]();
}

const findIdealA = (A: BigNumber, stillNeeded: number[]): BigNumber | false => {
	if (!stillNeeded.length) {
		return A;
	}
	const lookingFor = BigNumber(stillNeeded.pop()!);
	for (let i = ZERO; i.isLessThan(EIGHT); i = i.plus(ONE)) {
		registers.A = A.times(EIGHT).plus(i);
		for (
			instructionPointer = 0;
			instructionPointer < program.length - 4;

		) {
			instructions[program[instructionPointer]]();
		}
		if (registers.B.mod(EIGHT).isEqualTo(lookingFor)) {
			const idealA = findIdealA(A.times(EIGHT).plus(i), [...stillNeeded]);
			if (idealA) {
				return idealA;
			}
		}
	}
	return false;
};

console.log(findIdealA(ZERO, [...program]));

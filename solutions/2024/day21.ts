import { ONE, ZERO } from "#/utilities/constants";
import HashMap from "#/utilities/structures/HashMap";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

// Must format each input file line as CODE-NUMERIC_INSTRUCTIONS
// NUMERIC_INSTRUCTION needs to be found manually
// ex: 459A-^^<<A>A^>AvvvA
const data = readInputFile(2024, 21)
	.toString()
	.split("\n")
	.map((line) => line.split("-"));

type ArrowKey = "^" | "<" | "v" | ">" | "A";
type PathId = `${ArrowKey}-${ArrowKey}`;
const directionKeypad: Record<PathId, string> = {
	"^-^": "",
	"^-<": "v<", // cannot change
	"^-v": "v",
	"^->": "v>",
	"^-A": ">",
	"<-^": ">^", // cannot change
	"<-<": "",
	"<-v": ">",
	"<->": ">>",
	"<-A": ">>^", // cannot change
	"v-^": "^",
	"v-<": "<",
	"v-v": "",
	"v->": ">",
	"v-A": "^>",
	">-^": "<^", // cannot change
	">-<": "<<",
	">-v": "<",
	">->": "",
	">-A": "^",
	"A-^": "<",
	"A-<": "v<<", // cannot change
	"A-v": "<v",
	"A->": "v",
	"A-A": ""
};

const getKeyPresses = (keys: string): string => {
	const tokens = ("A" + keys).split("") as ArrowKey[];
	let presses = "";
	for (let i = 0; i < tokens.length - 1; i++) {
		presses += directionKeypad[`${tokens[i]}-${tokens[i + 1]}`] + "A";
	}
	return presses;
};

let sum = ZERO;
for (const line of data) {
	sum = sum.plus(
		BigNumber(line[0].substring(0, line[0].length - 1)).times(
			getKeyPresses(getKeyPresses(line[1])).length
		)
	);
}
console.log(sum);

const memory = new HashMap<
	{ to: ArrowKey; from: ArrowKey; callsRemaining: number },
	BigNumber
>(({ to, from, callsRemaining }) => `${to}-${from}-${callsRemaining}`);
const getRecursiveLength = (
	to: ArrowKey = "A",
	from: ArrowKey,
	callsRemaining: number
): BigNumber => {
	if (callsRemaining === 0) {
		return ONE;
	}
	if (memory.has({ to, from, callsRemaining })) {
		return memory.get({ to, from, callsRemaining })!;
	}
	let localSum = ZERO;
	const next = directionKeypad[`${to}-${from}`] + "A";
	const keys = next.split("") as ArrowKey[];
	for (let i = 0; i < keys.length; i++) {
		localSum = localSum.plus(
			getRecursiveLength(keys[i - 1], keys[i], callsRemaining - 1)
		);
	}
	memory.set({ to, from, callsRemaining }, localSum);
	return localSum;
};

sum = ZERO;
for (const line of data) {
	const keys = line[1].split("") as ArrowKey[];
	for (let i = 0; i < keys.length; i++) {
		sum = sum.plus(
			BigNumber(line[0].substring(0, line[0].length - 1)).times(
				getRecursiveLength(keys[i - 1], keys[i], 25)
			)
		);
	}
}

console.log(sum);

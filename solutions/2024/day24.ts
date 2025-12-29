import { TWO, ZERO } from "#/utilities/constants";
import { bitwiseXOR } from "#/utilities/general";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 24).toString().split("\n\n");

const initialValues: Partial<Record<string, boolean>> = {};

data[0].split("\n").forEach((row) => {
	const tokens = row.split(": ");
	initialValues[tokens[0]] = tokens[1] === "1";
});

const formulas = data[1].split("\n").map((row) => {
	const tokens = row.split(" ");
	return {
		a: tokens[0],
		op: tokens[1] as "AND" | "OR" | "XOR",
		b: tokens[2],
		c: tokens[4]
	};
});

const solveFormulas = () => {
	let values = { ...initialValues };

	let hasChanges = true;
	let level = 0;
	while (hasChanges) {
		hasChanges = false;
		console.log(level++);
		const newValues = { ...values };
		for (const formula of formulas) {
			if (
				values[formula.c] !== undefined ||
				values[formula.a] === undefined ||
				values[formula.b] === undefined
			) {
				continue;
			}
			console.log(formula);
			hasChanges = true;
			switch (formula.op) {
				case "AND":
					newValues[formula.c] =
						values[formula.a] && values[formula.b];
					break;
				case "OR":
					newValues[formula.c] =
						values[formula.a] || values[formula.b];
					break;
				case "XOR":
					newValues[formula.c] =
						values[formula.a] !== values[formula.b];
					break;
			}
		}
		values = newValues;
	}
	return values;
};

const fromBinary = (prefix: string, values: typeof initialValues) =>
	Object.keys(values)
		.filter((key) => key.startsWith(prefix))
		.reduce(
			(a, b) => (values[b] ? a.plus(TWO.pow(+b.substring(1))) : a),
			ZERO
		);

const defaultValues = solveFormulas();
console.log("Part 1: " + fromBinary("z", defaultValues));

// Part 2 ->
// TODO: Update `swappedWires` as you find them
const swappedWires: [string, string][] = [];
if (!swappedWires.length) {
	console.log("\nSolve part 2 by finding irregularities in the text below");
}
swappedWires.forEach(([a, b]) => {
	const aFormula = formulas.find((f) => f.c === a)!;
	const bFormula = formulas.find((f) => f.c === b)!;
	aFormula.c = b;
	bFormula.c = a;
});

const xValue = fromBinary("x", defaultValues);
const yValue = fromBinary("y", defaultValues);

const xySum = xValue.plus(yValue);
const sumBits = xySum.toString(2);
const bitDiff = [
	...bitwiseXOR(xValue.plus(yValue), fromBinary("z", solveFormulas()))
		.toString(2)
		.padStart(sumBits.length, "0")
		.split("")
		.reverse()
		.entries()
]
	.filter(([, bit]) => bit === "1")
	.map(([idx]) => {
		const key = `z${idx.toString().padStart(2, "0")}`;
		const formula = formulas.find((formula) => formula.c === key)!;
		return {
			key,
			formula,
			expected: sumBits[sumBits.length - 1 - idx],
			expanded: `${defaultValues[formula.a]} ${formula.op} ${defaultValues[formula.b]}`
		};
	});

const logDependencyFormulas = (keys: string[]) => {
	const nextKeys: string[] = [];
	keys.forEach((key) => {
		const formula = formulas.find((f) => f.c === key);
		if (formula) {
			console.log(formula);
			nextKeys.push(formula.a, formula.b);
		}
	});
	console.log("-----------------");
	if (nextKeys.length) {
		logDependencyFormulas(nextKeys);
	}
};

if (bitDiff[0]) {
	logDependencyFormulas([bitDiff[0].key]);
} else {
	console.log("Part 2: " + swappedWires.flat().sort().join());
}

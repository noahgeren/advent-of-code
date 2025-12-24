import { rref } from "#/utilities/matrix";
import HashSet from "#/utilities/structures/HashSet";
import { readFileSync } from "node:fs";

const data = readFileSync("./data/2025/day10.txt")
	.toString()
	.split("\n")
	.map((row) => {
		const tokens = row.split(" ");
		const diagram = tokens[0].replace(/\[|\]/g, "");
		const schematics = tokens.slice(1, tokens.length - 1).map((schematic) =>
			schematic
				.replace(/\(|\)/g, "")
				.split(",")
				.map((light) => +light)
		);
		const joltages = tokens[tokens.length - 1]
			.replace(/\{|\}/g, "")
			.split(",")
			.map((joltage) => +joltage);

		return { diagram, schematics, joltages };
	});

type Machine = (typeof data)[number];

const findFewestButtonPressedForDiagram = (machine: Machine): number => {
	const seen = new HashSet<string>((id) => id);
	let edge = new HashSet<string>((id) => id);
	edge.add(machine.diagram.replaceAll("#", "."));

	let buttonsPressed = 0;
	while (!edge.has(machine.diagram) && edge.size) {
		let newEdge = new HashSet<string>((id) => id);
		edge.forEach((initialState) => {
			machine.schematics.forEach((schematic) => {
				const newState = schematic.reduce<string>((state, button) => {
					return (
						state.substring(0, button) +
						(state.charAt(button) === "." ? "#" : ".") +
						state.substring(button + 1)
					);
				}, initialState);
				if (!seen.has(newState)) {
					seen.add(newState);
					newEdge.add(newState);
				}
			});
		});
		edge = newEdge;
		buttonsPressed++;
	}
	return buttonsPressed;
};

console.log(
	"Part 1:",
	data.reduce<number>(
		(buttonsPressed, machine) =>
			buttonsPressed + findFewestButtonPressedForDiagram(machine),
		0
	)
);

const findFewestButtonPressedForJoltages = (machine: Machine): number => {
	const augmentedMatrix: number[][] = machine.joltages.map((joltage, index) => {
		return machine.schematics.map((schematic) => schematic.includes(index) ? 1 : 0 as number).concat([joltage]);	
	});

	const rrefMatrix = rref(augmentedMatrix);
	const freeVariableMaximumsAndFunctions = [...Array(machine.schematics.length).keys()].map((index) => {
		const func = rrefMatrix.find((row) => row.findIndex((value) => value === 1) === index);
		if(!func) {
			return { max: Math.min(...machine.schematics[index].map((button) => machine.joltages[button])) };
		}
		return func;
	});

	const solution = findMinimumSolution(machine, freeVariableMaximumsAndFunctions);

	if(solution === Number.MAX_SAFE_INTEGER) {
		throw new Error("No solution found");
	}
	
	return solution;
};

interface FreeVariable {
	max: number;
	value?: number;
}
const findMinimumSolution = (machine: Machine, freeVariableMaximumsAndFunctions:  (FreeVariable | number[])[]): number => {
	// Find first free variable
	const freeVariable = freeVariableMaximumsAndFunctions.find((item) => !Array.isArray(item) && item.value === undefined) as FreeVariable | undefined;
	if(!freeVariable) {
		const values = freeVariableMaximumsAndFunctions.map((item, index) => {
			if(Array.isArray(item)) {
				let functionValue = item[item.length - 1];
				for(let i = index + 1; i < item.length - 1; i++) {
					functionValue -= item[i] * ((freeVariableMaximumsAndFunctions[i] as FreeVariable).value ?? 0);
				}
				return Math.round(functionValue);
			}
			return item.value!;
		});

		if(values.some(value => Math.round(value) < 0 || Math.abs(value - Math.round(value)) > 0.1)) {
			return Number.MAX_SAFE_INTEGER;
		}

		const actualJoltages = [...Array(machine.joltages.length)].fill(0);
		values.forEach((value, index) => {
			machine.schematics[index].forEach((button) => {
				actualJoltages[button] += value;
			});
		});
		if(actualJoltages.some((joltage, index) => Math.round(joltage) !== machine.joltages[index])) {
			return Number.MAX_SAFE_INTEGER;
		}

		return values.reduce((sum, value) => sum + value, 0);
	}

	let minimumSolution = Number.MAX_SAFE_INTEGER;
	for(let value = 0; value <= freeVariable.max; value++) {
		freeVariable.value = value;
		minimumSolution = Math.min(minimumSolution, findMinimumSolution(machine, freeVariableMaximumsAndFunctions));
	}
	freeVariable.value = undefined;

	return minimumSolution;
};

console.log("Part 2:",
	data.reduce<number>(
		(buttonsPressed, machine) =>
			buttonsPressed + findFewestButtonPressedForJoltages(machine),
		0
	)
);
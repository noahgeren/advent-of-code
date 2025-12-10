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

const findFewestButtonPressed = (machine: Machine): number => {
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
			buttonsPressed + findFewestButtonPressed(machine),
		0
	)
);

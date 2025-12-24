import { clear, readInputFile } from "#/utilities/general";
import {
	DIRECTIONS,
	moveDirection,
	printMatrix,
	Vector2d
} from "#/utilities/matrix";
import HashMap from "#/utilities/structures/HashMap";
import HashSet from "#/utilities/structures/HashSet";
import BigNumber from "bignumber.js";

const map = readInputFile(2023, 21)
	.split("\n")
	.map((row) => row.split(""));

let start = { x: -1, y: -1 };
findStart: for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		if (map[y][x] === "S") {
			start = { x, y };
			map[y][x] = ".";
			break findStart;
		}
	}
}

const memory = new HashMap<{ start: Vector2d; steps: number }, BigNumber>(
	({ start, steps }) =>
		(steps * map.length + start.y) * map[start.y].length + start.x
);
const findReachablePlots = (
	start: Vector2d,
	steps: Readonly<number>
): BigNumber => {
	if (memory.has({ start, steps })) {
		return memory.get({ start, steps })!;
	}
	const hashFn = (coord: Vector2d) =>
		coord.y * map[0].length * steps + coord.x;
	let edge = new HashSet<Vector2d>(hashFn, [start]);
	const seen = new HashSet<Vector2d>(hashFn);
	const steppable = new HashSet<Vector2d>(hashFn);
	for (let step = 0; step < steps; step++) {
		edge.forEach((e) => {
			seen.add(e);
			if (step % 2 === steps % 2) {
				steppable.add(e);
			}
		});
		const newEdge = new HashSet<Vector2d>(hashFn);
		for (const coord of edge) {
			for (const direction of DIRECTIONS) {
				const newCoord = moveDirection(coord, direction);
				if (
					map[newCoord.y]?.[newCoord.x] === "." &&
					!seen.has(newCoord)
				) {
					newEdge.add(newCoord);
				}
			}
		}
		edge = newEdge;
	}
	clear();
	printMatrix(map, "", (coord) =>
		steppable.has(coord) || edge.has(coord) ? "O" : undefined
	);
	const result = BigNumber(steppable.size + edge.size);
	memory.set({ start, steps }, result);
	return result;
};

console.log(findReachablePlots(start, 64));

import { DIRECTION_MAP, Vector2d } from "#/utilities/matrix";
import HashSet from "#/utilities/structures/HashSet";
import { readInputFile } from "#/utilities/general";
import TinyQueue from "tinyqueue";

const map = readInputFile(2024, 20)
	.toString()
	.split("\n")
	.map((row) => row.split(""));

let start = { x: 0, y: 0 },
	end = start;
for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		if (map[y][x] === "S") {
			start = { x, y };
			map[y][x] = ".";
		} else if (map[y][x] === "E") {
			end = { x, y };
			map[y][x] = ".";
		}
	}
}

const solveMaze = (): Vector2d[] => {
	const seen = new HashSet<Vector2d>(
		(coord) => coord.y * map[0].length + coord.x
	);

	const remainingPositions = new TinyQueue(
		[{ coord: { ...start }, path: [{ ...start }] as Vector2d[] }],
		(a, b) => a.path.length - b.path.length
	);

	while (remainingPositions.length) {
		const { coord, path } = remainingPositions.pop()!;
		if (coord.x === end.x && coord.y === end.y) {
			return path;
		}
		for (const direction of Object.values(DIRECTION_MAP)) {
			const newCoord = {
				x: coord.x + direction.x,
				y: coord.y + direction.y
			};
			if (
				newCoord.x < 0 ||
				newCoord.x >= map[0].length ||
				newCoord.y < 0 ||
				newCoord.y >= map.length ||
				map[newCoord.y][newCoord.x] === "#" ||
				seen.has(newCoord)
			) {
				continue;
			}
			seen.add(newCoord);
			remainingPositions.push({
				coord: newCoord,
				path: [...path, newCoord]
			});
		}
	}

	return [];
};

const path = solveMaze();

const countCheats = (cheatTime: number): number => {
	let count = 0;
	for (let i = 0; i < path.length - 1; i++) {
		for (let j = i + 1; j < path.length; j++) {
			const distance =
				Math.abs(path[i].x - path[j].x) +
				Math.abs(path[i].y - path[j].y);
			if (distance <= cheatTime && j - i - distance >= 100) {
				console.log;
				count++;
			}
		}
	}
	return count;
};

console.log(countCheats(2));
console.log(countCheats(20));

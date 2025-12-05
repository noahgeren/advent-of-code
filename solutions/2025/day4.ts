import { readFileSync } from "node:fs";

const initialMap = readFileSync("./data/2025/day4.txt")
	.toString()
	.split("\n")
	.map((row) => row.trim().split(""));

const countAccessibleRolls = (
	map: string[][]
): { accessibleRolls: number; newMap: string[][] } => {
	let accessibleRolls = 0;
	let newMap = map.map((row) => [...row]);
	for (let y = 0; y < map.length; y++) {
		mapLoop: for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] !== "@") continue;
			let adjacentRolls = 0;
			for (let i = 0; i < 9; i++) {
				if (i === 4) continue;
				if (map[y + Math.floor(i / 3) - 1]?.[x + (i % 3) - 1] === "@") {
					adjacentRolls++;
					if (adjacentRolls >= 4) {
						continue mapLoop;
					}
				}
			}
			newMap[y][x] = ".";
			accessibleRolls++;
		}
	}
	return { accessibleRolls, newMap };
};

let rolls = countAccessibleRolls(initialMap);
console.log("Part 1:", rolls.accessibleRolls);

let totalAccessibleRolls = 0;
while (rolls.accessibleRolls) {
	totalAccessibleRolls += rolls.accessibleRolls;
	rolls = countAccessibleRolls(rolls.newMap);
}
console.log("Part 2:", totalAccessibleRolls);

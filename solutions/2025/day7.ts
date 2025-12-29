import HashMap from "#/utilities/structures/HashMap";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2025, 7)
	.toString()
	.split("\n")
	.map((row) => row.split(""));

const seen = new HashMap<{ y: number; x: number }, BigNumber>(
	({ y, x }) => y * data[0].length + x
);

let splitCount = 0;
const countPaths = (coord: { y: number; x: number }): BigNumber => {
	const { y, x } = coord;
	if (seen.has(coord)) {
		return seen.get(coord)!;
	}
	if (y >= data.length) {
		return BigNumber(1);
	}
	if (data[y][x] === ".") {
		const paths = countPaths({ x, y: y + 1 });
		seen.set(coord, paths);
		return paths;
	}
	splitCount++;
	let paths = BigNumber(0);
	if (x - 1 >= 0) {
		paths = paths.plus(countPaths({ x: x - 1, y: y + 1 }));
	}
	if (x + 1 < data[0].length) {
		paths = paths.plus(countPaths({ x: x + 1, y: y + 1 }));
	}
	seen.set(coord, paths);
	return paths;
};

const totalPaths = countPaths({ y: 1, x: data[0].findIndex((c) => c === "S") });

console.log("Part 1:", splitCount);
console.log("Part 2:", totalPaths);

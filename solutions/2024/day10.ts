import { readInputFile } from "#/utilities/general";

const map = readInputFile(2024, 10)
	.toString()
	.split("\n")
	.map((line) => line.split("").map((n) => +n));

const trailheadScore = (x: number, y: number, expected: number): number[] => {
	if (
		y < 0 ||
		y >= map.length ||
		x < 0 ||
		x >= map[0].length ||
		map[y][x] !== expected
	)
		return [];
	if (expected === 9) return [y * map[0].length + x];
	return [
		...trailheadScore(x + 1, y, expected + 1),
		...trailheadScore(x - 1, y, expected + 1),
		...trailheadScore(x, y + 1, expected + 1),
		...trailheadScore(x, y - 1, expected + 1)
	];
};

let sumA = 0;
let sumB = 0;
map.forEach((row, y) => {
	row.forEach((height, x) => {
		const score = trailheadScore(x, y, 0);
		sumA += new Set(score).size;
		sumB += score.length;
	});
});

console.log(sumA, sumB);

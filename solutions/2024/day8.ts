import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 8)
	.toString()
	.split("\n")
	.map((row) => row.split(""));

const antennas: Partial<Record<string, { x: number; y: number }[]>> = {};

data.forEach((row, y) => {
	row.forEach((cell, x) => {
		if (cell !== ".") {
			if (antennas[cell]?.length) {
				antennas[cell].push({ x, y });
			} else {
				antennas[cell] = [{ x, y }];
			}
		}
	});
});

const inBounds = (point: { x: number; y: number }): boolean => {
	return (
		point.x >= 0 &&
		point.x < data[0].length &&
		point.y >= 0 &&
		point.y < data.length
	);
};

let distinct = new Set<number>();
Object.values(antennas).forEach((set) => {
	if (!set?.length) return;
	for (let i = 0; i < set.length - 1; i++) {
		for (let j = i + 1; j < set.length; j++) {
			let slope = { x: set[i].x - set[j].x, y: set[i].y - set[j].y };
			let antinode = { x: set[i].x + slope.x, y: set[i].y + slope.y };
			if (inBounds(antinode)) {
				distinct.add(antinode.y * data[0].length + antinode.x);
			}
			antinode = { x: set[j].x - slope.x, y: set[j].y - slope.y };
			if (inBounds(antinode)) {
				distinct.add(antinode.y * data[0].length + antinode.x);
			}
		}
	}
});

console.log(distinct.size);

distinct.clear();

Object.values(antennas).forEach((set) => {
	if (!set?.length) return;
	for (let i = 0; i < set.length - 1; i++) {
		for (let j = i + 1; j < set.length; j++) {
			let slope = { x: set[i].x - set[j].x, y: set[i].y - set[j].y };
			let antinode = { ...set[i] };
			while (inBounds(antinode)) {
				distinct.add(antinode.y * data[0].length + antinode.x);
				antinode.x += slope.x;
				antinode.y += slope.y;
			}
			antinode = { ...set[j] };
			while (inBounds(antinode)) {
				distinct.add(antinode.y * data[0].length + antinode.x);
				antinode.x -= slope.x;
				antinode.y -= slope.y;
			}
		}
	}
});

console.log(distinct.size);

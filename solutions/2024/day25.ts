import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 25).toString().split("\n\n");

const height = data[0].split("\n").length;
const locks: number[][] = [];
const keys: number[][] = [];

data.forEach((item) => {
	const lines = item.split("\n");
	const columns = Array<number>(lines[0].length).fill(0);
	lines.forEach((line) =>
		line.split("").forEach((char, idx) => {
			if (char === "#") {
				columns[idx]++;
			}
		})
	);
	if (item.startsWith("#")) {
		locks.push(columns);
	} else {
		keys.push(columns);
	}
});

let sum = 0;
for (const lock of locks) {
	for (const key of keys) {
		if (lock.every((pin, idx) => pin + key[idx] <= height)) {
			sum++;
		}
	}
}
console.log(sum);

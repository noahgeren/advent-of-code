import { readInputFile } from "#/utilities/general";
import { Vector3d } from "#/utilities/matrix";
import cloneDeep from "lodash.clonedeep";

const initialBricks = readInputFile(2023, 22)
	.split("\n")
	.map((row) => {
		const [start, end] = row.split("~");
		let [x0, y0, z0] = start.split(",").map((n) => +n);
		let [x1, y1, z1] = end.split(",").map((n) => +n);
		if (x1 < x0) {
			[x0, x1] = [x1, x0];
		}
		if (y1 < y0) {
			[y0, y1] = [y1, y0];
		}
		if (z1 < z0) {
			[z0, z1] = [z1, z0];
		}
		return { start: { x: x0, y: y0, z: z0 }, end: { x: x1, y: y1, z: z1 } };
	})
	.sort((a, b) => a.start.z - b.start.z);

const findPossibleBrickMinZ = (
	bricks: typeof initialBricks,
	index: number
): number => {
	const brick = bricks[index];
	let maxZBelowBrick = 0;
	for (let x = brick.start.x; x <= brick.end.x; x++) {
		for (let y = brick.start.y; y <= brick.end.y; y++) {
			const maxZBelowCube = Math.max(
				0,
				...bricks
					.filter(
						(otherBrick) =>
							otherBrick.end.z < brick.start.z &&
							x >= otherBrick.start.x &&
							x <= otherBrick.end.x &&
							y >= otherBrick.start.y &&
							y <= otherBrick.end.y
					)
					.map((otherBrick) => otherBrick.end.z)
			);
			maxZBelowBrick = Math.max(maxZBelowBrick, maxZBelowCube);
			if (maxZBelowBrick + 1 === brick.start.z) {
				return brick.start.z;
			}
		}
	}
	return maxZBelowBrick + 1;
};

const settledBricks = cloneDeep(initialBricks);
settledBricks.forEach((brick, index) => {
	const possibleMinZ = findPossibleBrickMinZ(settledBricks, index);
	const diff = brick.start.z - possibleMinZ;
	if (diff > 0) {
		settledBricks[index] = {
			start: { ...brick.start, z: brick.start.z - diff },
			end: { ...brick.end, z: brick.end.z - diff }
		};
	}
});

let safeToDisintegrate = 0;
let totalFallenBricks = 0;
for (
	let removedIndex = 0;
	removedIndex < settledBricks.length;
	removedIndex++
) {
	console.log(`${removedIndex}/${settledBricks.length}`);
	const newBricks = cloneDeep(settledBricks).filter(
		(_, index) => removedIndex !== index
	);
	let fallenBricks = 0;
	newBricks.forEach((brick, index) => {
		const possibleMinZ = findPossibleBrickMinZ(newBricks, index);
		const diff = brick.start.z - possibleMinZ;
		if (diff > 0) {
			newBricks[index] = {
				start: { ...brick.start, z: brick.start.z - diff },
				end: { ...brick.end, z: brick.end.z - diff }
			};
			fallenBricks++;
		}
	});
	if (fallenBricks === 0) {
		safeToDisintegrate++;
	}
	totalFallenBricks += fallenBricks;
}

console.log("Part 1:", safeToDisintegrate);
console.log("Part 2:", totalFallenBricks);

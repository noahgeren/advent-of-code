import { readInputFile } from "#/utilities/general";
import { Vector3d } from "#/utilities/matrix";
import cloneDeep from "lodash.clonedeep";

const initialBricks = readInputFile(2023, 22)
	.split("\n")
	.map((row) => {
		const cubes: Vector3d[] = [];
		const [start, end] = row.split("~");
		const [x0, y0, z0] = start.split(",").map((n) => +n);
		const [x1, y1, z1] = end.split(",").map((n) => +n);
		for (let x = x0; x <= x1; x++) {
			for (let y = y0; y <= y1; y++) {
				for (let z = z0; z <= z1; z++) {
					cubes.push({ x, y, z });
				}
			}
		}
		return cubes;
	})
	.sort(
		(a, b) =>
			Math.min(...a.map((v) => v.z)) - Math.min(...b.map((v) => v.z))
	);

const findPossibleBrickMinZ = (bricks: Vector3d[][], index: number): number => {
	const brick = bricks[index];
	return Math.max(
		...brick.map((cube) => {
			const bricksBelowCube = bricks.filter(
				(otherBrick, otherIndex) =>
					index !== otherIndex &&
					otherBrick.some(
						(otherCube) =>
							otherCube.x === cube.x &&
							otherCube.y === cube.y &&
							otherCube.z < cube.z
					)
			);
			const maxZsBelowCube = bricksBelowCube.map((brick) =>
				Math.max(...brick.map((otherCube) => otherCube.z))
			);
			return Math.max(0, ...maxZsBelowCube) + 1;
		})
	);
};

const settledBricks = cloneDeep(initialBricks);
settledBricks.forEach((brick, index) => {
	const minZ = Math.min(...brick.map((cube) => cube.z));
	const possibleMinZ = findPossibleBrickMinZ(settledBricks, index);
	const diff = minZ - possibleMinZ;
	if (diff > 0) {
		settledBricks[index] = brick.map((cube) => ({
			...cube,
			z: cube.z - diff
		}));
	}
});

console.log("Done");

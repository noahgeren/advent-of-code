import { readInputFile } from "#/utilities/general";

interface Vector3d {
	x: number;
	y: number;
	z: number;
}
const data = readInputFile(2025, 8)
	.toString()
	.split("\n")
	.map<Vector3d>((row) => {
		const tokens = row.split(",");
		return {
			x: +tokens[0],
			y: +tokens[1],
			z: +tokens[2]
		};
	});

const distances: { boxA: Vector3d; boxB: Vector3d; distance: number }[] = [];

for (let i = 0; i < data.length; i++) {
	for (let j = i + 1; j < data.length; j++) {
		distances.push({
			boxA: data[i],
			boxB: data[j],
			distance:
				Math.pow(data[i].x - data[j].x, 2) +
				Math.pow(data[i].y - data[j].y, 2) +
				Math.pow(data[i].z - data[j].z, 2)
		});
	}
}

distances.sort((a, b) => a.distance - b.distance);

const isEqualVector = (a: Vector3d, b: Vector3d) =>
	a.x === b.x && a.y === b.y && a.z === b.z;

const circuits: Vector3d[][] = [];
const processBoxes = (distanceIdx: number) => {
	const { boxA, boxB } = distances[distanceIdx];
	const circuitAIdx = circuits.findIndex((circuit) =>
		circuit.some((box) => isEqualVector(boxA, box))
	);
	const circuitBIdx = circuits.findIndex((circuit) =>
		circuit.some((box) => isEqualVector(boxB, box))
	);
	if (circuitAIdx !== -1 && circuitBIdx !== -1) {
		if (circuitAIdx !== circuitBIdx) {
			// Combine circuits
			circuits[circuitAIdx].push(...circuits[circuitBIdx]);
			circuits.splice(circuitBIdx, 1);
		}
	} else if (circuitAIdx !== -1) {
		// Add boxB to circuitA
		circuits[circuitAIdx].push(boxB);
	} else if (circuitBIdx !== -1) {
		// Add boxA to circuitB
		circuits[circuitBIdx].push(boxA);
	} else {
		// Create new circuit
		circuits.push([boxA, boxB]);
	}
};

const connections = data.length > 100 ? 1000 : 10;
for (let i = 0; i < connections; i++) {
	processBoxes(i);
}

const circuitSizes = circuits
	.map((circuit) => circuit.length)
	.sort((a, b) => a - b)
	.reverse();

console.log("Part 1:", circuitSizes[0] * circuitSizes[1] * circuitSizes[2]);

let i = connections;
while (circuits[0].length < data.length) {
	processBoxes(i++);
}

console.log("Part 2:", distances[i - 1].boxA.x * distances[i - 1].boxB.x);

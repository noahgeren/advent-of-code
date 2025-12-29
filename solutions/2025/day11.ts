import HashMap from "#/utilities/structures/HashMap";
import { readInputFile } from "#/utilities/general";

const connections = readInputFile(2025, 11)
	.toString()
	.split("\n")
	.reduce<Record<string, string[]>>((connections, row) => {
		const tokens = row.split(" ");
		connections[tokens[0].replaceAll(":", "")] = tokens.slice(1);
		return connections;
	}, {});

const seenPaths = new HashMap<string[], number>((key) => key.join());
const countPaths = (device: string, needed: string[] = []): number => {
	if (device === "out") {
		return needed.length === 0 ? 1 : 0;
	}
	const key = [device, ...needed];
	if (seenPaths.has(key)) {
		return seenPaths.get(key)!;
	}
	const paths = connections[device].reduce<number>(
		(paths, newDevice) =>
			paths +
			countPaths(
				newDevice,
				needed.filter((d) => d !== device)
			),
		0
	);
	seenPaths.set(key, paths);
	return paths;
};

console.log("Part 1:", countPaths("you"));

seenPaths.clear();

console.log("Path 2:", countPaths("svr", ["dac", "fft"]));

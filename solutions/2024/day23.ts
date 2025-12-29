import { intersection } from "#/utilities/general";
import HashSet from "#/utilities/structures/HashSet";
import { readInputFile } from "#/utilities/general";

const connections = readInputFile(2024, 23)
	.toString()
	.split("\n")
	.map((row) => row.split("-") as [string, string]);

const multiconnections: Record<string, string[]> = {};
connections.forEach(([a, b]) => {
	multiconnections[a] ??= [];
	multiconnections[b] ??= [];
	multiconnections[a].push(b);
	multiconnections[b].push(a);
});

// triples are best
const triples = new HashSet<string[]>((key) => key.sort().join());
for (const [first, nextConnections] of Object.entries(multiconnections)) {
	for (const second of nextConnections) {
		for (const third of multiconnections[second]) {
			if (first === third || !nextConnections.includes(third)) {
				continue;
			}
			triples.add([first, second, third]);
		}
	}
}
console.log(
	[...triples].filter((triplet) =>
		triplet.some((comp) => comp.startsWith("t"))
	).length
);

const groups = [...triples];
let again = true;
while (again) {
	again = false;
	for (const group of groups) {
		const newAdditions = intersection(
			...group.map((comp) => multiconnections[comp])
		);
		if (newAdditions.length) {
			again = true;
			group.push(newAdditions[0]);
		}
	}
}

console.log(
	groups
		.sort((a, b) => b.length - a.length)[0]
		.sort()
		.join()
);

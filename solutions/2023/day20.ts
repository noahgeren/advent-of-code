import { lcm, readInputFile } from "#/utilities/general";

const MODULE_TYPES = ["broadcaster", "%", "&"] as const;
interface BroadcasterModule {
	type: "broadcaster";
	destinations: string[];
}
interface FlipFlopModule {
	type: "%";
	state: boolean;
	destinations: string[];
}
interface ConjunctionModule {
	type: "&";
	inputStates: Record<string, boolean>;
	destinations: string[];
}
type Module = BroadcasterModule | FlipFlopModule | ConjunctionModule;

const modules: Record<string, Module> = {};
// Load modules from file
readInputFile(2023, 20)
	.split("\n")
	.map((row) => {
		const [moduleAndType, dest] = row.split(" -> ");
		const type = MODULE_TYPES.find((type) =>
			moduleAndType.startsWith(type)
		)!;
		const name = type === "broadcaster" ? type : moduleAndType.slice(1);
		let module = { type, destinations: dest.split(", ") } as Module;
		if (type === "%") {
			module = { ...module, state: false } as FlipFlopModule;
		} else if (type === "&") {
			module = { ...module, inputStates: {} } as ConjunctionModule;
		}
		modules[name] = module;
	});

// Populate input states
Object.entries(modules).forEach(([id, module]) => {
	if (module.type === "&") {
		const inputIds = Object.keys(modules).filter((inId) =>
			modules[inId].destinations.includes(id)
		);
		inputIds.forEach((inputId) => (module.inputStates[inputId] = false));
	}
});

interface Pulse {
	input: string;
	destination: string;
	high: boolean;
}

let lowPulseCount = 0,
	highPulseCount = 0;
const processPulses = (pulses: Pulse[]): Pulse[] => {
	lowPulseCount += pulses.filter((p) => !p.high).length;
	highPulseCount += pulses.filter((p) => p.high).length;
	return pulses.flatMap((pulse): Pulse[] => {
		const module = modules[pulse.destination] as Module | undefined;
		if (module === undefined) {
			// Unknown module type
			return [];
		} else if (module.type === "%") {
			// flip-flop module
			if (pulse.high) {
				return [];
			}
			module.state = !module.state;
			return module.destinations.map((destination) => ({
				destination,
				high: module.state,
				input: pulse.destination
			}));
		} else if (module.type === "&") {
			// conjunction module
			module.inputStates[pulse.input] = pulse.high;
			const high = !Object.values(module.inputStates).every((h) => h);
			return module.destinations.map((destination) => ({
				destination,
				high,
				input: pulse.destination
			}));
		}
		// broadcaster module
		return module.destinations.map((destination) => ({
			destination,
			high: pulse.high,
			input: pulse.destination
		}));
	});
};

const rxInputId = Object.keys(modules).find((id) =>
	modules[id].destinations.includes("rx")
)!;
const minButtonPresses = Object.keys(modules)
	.filter((id) => modules[id].destinations.includes(rxInputId))
	.reduce<Record<string, number>>((obj, id) => {
		obj[id] = Number.MAX_SAFE_INTEGER;
		return obj;
	}, {});

for (
	let buttonPresses = 0;
	Object.values(minButtonPresses).some((v) => v === Number.MAX_SAFE_INTEGER);
	buttonPresses++
) {
	if (buttonPresses === 1000) {
		console.log("Part 1:", lowPulseCount * highPulseCount);
	}
	let pulses: Pulse[] = [
		{ input: "button", destination: "broadcaster", high: false }
	];
	while (pulses.length) {
		const rxInput = modules[rxInputId] as ConjunctionModule;
		Object.entries(rxInput.inputStates).forEach(([id, high]) => {
			if (high) {
				minButtonPresses[id] = Math.min(
					minButtonPresses[id],
					buttonPresses + 1
				);
			}
		});
		pulses = processPulses(pulses);
	}
}

console.log("Part 2:", lcm(...Object.values(minButtonPresses)));

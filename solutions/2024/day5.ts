import { readInputFile } from "#/utilities/general";

const lines = readInputFile(2024, 5).toString().split("\n");

const rules: Partial<Record<number, number[]>> = {};
const updates: number[][] = [];
let parsingRules = true;
lines.forEach((line) => {
	if (!line) {
		parsingRules = false;
		return;
	}
	if (parsingRules) {
		const nums = line.split("|").map((n) => +n);
		if (rules[nums[1]]) {
			rules[nums[1]]?.push(nums[0]);
		} else {
			rules[nums[1]] = [nums[0]];
		}
	} else {
		updates.push(line.split(",").map((n) => +n));
	}
});

const validUpdates: number[][] = [];
const invalidUpdates: number[][] = [];

updates.forEach((update) => {
	if (
		update.every(
			(n, idx) =>
				!rules[n] ||
				rules[n].every((pred) => !update.slice(idx).includes(pred))
		)
	) {
		validUpdates.push(update);
	} else {
		invalidUpdates.push(update);
	}
});

const validSum = validUpdates.reduce((a, b) => {
	return a + b[Math.floor(b.length / 2)];
}, 0);

console.log(validSum);

const fixUpdateOrder = (update: number[], idx: number): number[] => {
	if (idx >= update.length) return update;
	const rule = rules[update[idx]];
	if (rule) {
		rule.forEach((before) => {
			if (update.slice(idx).includes(before)) {
				update = update.filter((x) => x !== before);
				update.splice(idx--, 0, before);
			}
		});
	}
	return fixUpdateOrder(update, idx + 1);
};

const invalidSum = invalidUpdates.reduce((a, b) => {
	const updated = fixUpdateOrder(b, 0);
	return a + updated[Math.floor(updated.length / 2)];
}, 0);

console.log(invalidSum.toFixed());

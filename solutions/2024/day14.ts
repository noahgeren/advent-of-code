import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const guards = readInputFile(2024, 14)
	.toString()
	.split("\n")
	.map((line) => {
		const tokens = line.split(/,|=| /g);
		return {
			position: {
				x: +tokens[1],
				y: +tokens[2]
			},
			velocity: {
				x: +tokens[4],
				y: +tokens[5]
			}
		};
	})
	.map((guard) => ({
		...guard,
		initialPosition: { ...guard.position } as const
	}));

const WIDTH = 101,
	HEIGHT = 103;
// const WIDTH = 11,
// 	HEIGHT = 7;
const SECONDS = 100;
const MID_WIDTH = Math.floor(WIDTH / 2),
	MID_HEIGHT = Math.floor(HEIGHT / 2);

const counts = [0, 0, 0, 0];
guards.forEach((guard) => {
	guard.position.x =
		(((SECONDS * guard.velocity.x + guard.position.x) % WIDTH) + WIDTH) %
		WIDTH;
	guard.position.y =
		(((SECONDS * guard.velocity.y + guard.position.y) % HEIGHT) + HEIGHT) %
		HEIGHT;

	if (guard.position.x < MID_WIDTH) {
		if (guard.position.y < MID_HEIGHT) {
			counts[0]++;
		} else if (guard.position.y > MID_HEIGHT) {
			counts[1]++;
		}
	} else if (guard.position.x > MID_WIDTH) {
		if (guard.position.y < MID_HEIGHT) {
			counts[2]++;
		} else if (guard.position.y > MID_HEIGHT) {
			counts[3]++;
		}
	}
});

console.log(counts.reduce((a, b) => a.times(b), BigNumber(1)).toFixed());

const B_ANSWER = 8149; // Found this for my solution by trial and error
for (let seconds = SECONDS; seconds < B_ANSWER; seconds++) {
	guards.forEach((guard) => {
		guard.position.x =
			(guard.position.x + guard.velocity.x + WIDTH) % WIDTH;
		guard.position.y =
			(guard.position.y + guard.velocity.y + HEIGHT) % HEIGHT;
	});
}

const grid = [...Array<string[]>(HEIGHT)].map((_) =>
	Array<string>(WIDTH).fill(" ")
);
guards.forEach((guard) => (grid[guard.position.y][guard.position.x] = "*"));
grid.forEach((row) => {
	console.log(row.join(""));
});

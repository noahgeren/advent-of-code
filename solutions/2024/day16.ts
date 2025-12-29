import { ONE, ZERO } from "#/utilities/constants";
import { Direction, moveDirection, Vector2d } from "#/utilities/matrix";
import HashSet from "#/utilities/structures/HashSet";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";
import TinyQueue from "tinyqueue";

const map = readInputFile(2024, 16)
	.toString()
	.split("\n")
	.map((row) => row.split(""));
const start = { x: 0, y: 0 };
const end = { x: 0, y: 0 };
for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map.length; x++) {
		if (map[y][x] === "S") {
			start.x = x;
			start.y = y;
			map[y][x] = ".";
		} else if (map[y][x] === "E") {
			end.x = x;
			end.y = y;
			map[y][x] = ".";
		}
	}
}

interface Position {
	coord: Vector2d;
	direction: Direction;
}

const seen = new HashSet<Position>(
	(pos) => pos.coord.y * map[0].length * 4 + pos.coord.x * 4 + pos.direction
);
const distinctCoords = new HashSet<Vector2d>(
	(coord) => coord.y * map[0].length + coord.x
);
interface PositionTotal {
	position: Position;
	total: BigNumber;
	history: Vector2d[];
}
let remainingPositions = new TinyQueue<PositionTotal>(
	[
		{
			position: { coord: start, direction: Direction.RIGHT },
			total: ZERO,
			history: []
		}
	],
	(a, b) => a.total.comparedTo(b.total)
);

const ONE_THOUSAND = BigNumber("1000");
let minimumScore = BigNumber(map.length * map[0].length).times(ONE_THOUSAND);
while (remainingPositions.length) {
	const { position, total, history } = remainingPositions.pop()!;
	seen.add(position);
	const newHistory = [...history, position.coord];
	if (position.coord.x === end.x && position.coord.y === end.y) {
		if (total.comparedTo(minimumScore) > 0) {
			break;
		}
		newHistory.forEach((coord) => distinctCoords.add(coord));
		minimumScore = total;
	}
	// Forward
	const newPositions: PositionTotal[] = [
		{
			position: {
				...position,
				coord: moveDirection(position.coord, position.direction)
			},
			total: total.plus(ONE),
			history: newHistory
		},
		{
			position: {
				...position,
				direction: (position.direction + 1) % 4
			},
			total: total.plus(ONE_THOUSAND),
			history: newHistory
		},
		{
			position: {
				...position,
				direction: (position.direction + 3) % 4
			},
			total: total.plus(ONE_THOUSAND),
			history: newHistory
		}
	];

	for (const newPosition of newPositions) {
		if (
			map[newPosition.position.coord.y][newPosition.position.coord.x] !==
				"#" &&
			!seen.has(newPosition.position)
		) {
			remainingPositions.push(newPosition);
		}
	}
}

console.log(minimumScore.toFixed());
console.log(distinctCoords.size);

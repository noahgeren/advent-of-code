import { Vector2d } from "#/utilities/matrix";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 15).toString().split("\n\n");
const initialMap = data[0].split("\n").map((row) => row.split(""));
const instructions = data[1].split(/\n|/g) as ("<" | ">" | "^" | "v")[];
const DIRECTIONS = {
	"<": { x: -1, y: 0 },
	"^": { x: 0, y: -1 },
	">": { x: 1, y: 0 },
	v: { x: 0, y: 1 }
};

let initialPosition = { x: 0, y: 0 };
findStartLoop: for (let y = 0; y < initialMap.length; y++) {
	for (let x = 0; x < initialMap[y].length; x++) {
		if (initialMap[y][x] === "@") {
			initialPosition = { x, y };
			initialMap[y][x] = ".";
			break findStartLoop;
		}
	}
}

let map = initialMap.map((row) => [...row]);
let position = { ...initialPosition };

let moveBox = (
	box: Vector2d,
	direction: Vector2d,
	actuallyMove = true
): boolean => {
	if (map[box.y][box.x] === ".") {
		return true;
	}
	if (
		map[box.y][box.x] === "O" &&
		moveBox({ x: box.x + direction.x, y: box.y + direction.y }, direction)
	) {
		map[box.y + direction.y][box.x + direction.x] = "O";
		map[box.y][box.x] = ".";
		return true;
	}
	return false;
};

for (const inst of instructions) {
	const direction = DIRECTIONS[inst];
	const newPosition = {
		x: position.x + direction.x,
		y: position.y + direction.y
	};
	if (
		map[newPosition.y][newPosition.x] === "." ||
		(map[newPosition.y][newPosition.x] === "O" &&
			moveBox(newPosition, direction))
	) {
		position = newPosition;
	}
}

let sum = BigNumber(0);
for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		if (map[y][x] === "O") {
			sum = sum.plus(y * 100 + x);
		}
	}
}
console.log(sum.toFixed());

map = initialMap.map((row) =>
	row
		.map((cell) => {
			if (cell === "#") {
				return ["#", "#"];
			} else if (cell === "O") {
				return ["[", "]"];
			}
			return [".", "."];
		})
		.flat()
);

position = { x: initialPosition.x * 2, y: initialPosition.y };

moveBox = (box, direction, actuallyMove = true): boolean => {
	if (map[box.y][box.x] === "#") {
		return false;
	} else if (map[box.y][box.x] === ".") {
		return true;
	}

	if (direction.x === 0) {
		// up/down - [
		switch (map[box.y][box.x]) {
			case "]":
				return (
					moveBox(
						{ x: box.x, y: box.y + direction.y },
						direction,
						actuallyMove
					) &&
					moveBox({ x: box.x - 1, y: box.y }, direction, actuallyMove)
				);
			case "[":
				if (
					moveBox(
						{ x: box.x + 1, y: box.y + direction.y },
						direction,
						actuallyMove
					) &&
					moveBox(
						{ x: box.x, y: box.y + direction.y },
						direction,
						actuallyMove
					)
				) {
					if (actuallyMove) {
						map[box.y + direction.y][box.x] = "[";
						map[box.y + direction.y][box.x + 1] = "]";
						map[box.y][box.x] = ".";
						map[box.y][box.x + 1] = ".";
					}
					return true;
				}
		}
	} else if (direction.x > 0) {
		// right - [
		switch (map[box.y][box.x]) {
			case "]":
				return moveBox(
					{ x: box.x + 1, y: box.y },
					direction,
					actuallyMove
				);
			case "[":
				if (
					moveBox({ x: box.x + 1, y: box.y }, direction, actuallyMove)
				) {
					if (actuallyMove) {
						map[box.y][box.x + 1] = "[";
						map[box.y][box.x + 2] = "]";
						map[box.y][box.x] = ".";
					}
					return true;
				}
		}
	} else {
		// left - ]
		switch (map[box.y][box.x]) {
			case "]":
				if (
					moveBox({ x: box.x - 1, y: box.y }, direction, actuallyMove)
				) {
					if (actuallyMove) {
						map[box.y][box.x - 1] = "]";
						map[box.y][box.x - 2] = "[";
						map[box.y][box.x] = ".";
					}
					return true;
				}
				break;
			case "[":
				return moveBox(
					{ x: box.x - 1, y: box.y },
					direction,
					actuallyMove
				);
		}
	}
	return false;
};

for (const inst of instructions) {
	const direction = DIRECTIONS[inst];
	const newPosition = {
		x: position.x + direction.x,
		y: position.y + direction.y
	};
	switch (map[newPosition.y][newPosition.x]) {
		case ".":
			position = newPosition;
		case "#":
			continue;
	}
	if (moveBox(newPosition, direction, false)) {
		moveBox(newPosition, direction);
		position = newPosition;
	}
}

sum = BigNumber(0);
for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		if (map[y][x] === "[") {
			sum = sum.plus(y * 100 + x);
		}
	}
}

console.log(sum.toFixed());

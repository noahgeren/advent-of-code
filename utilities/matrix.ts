export interface Vector2d<T = number> {
	x: T;
	y: T;
}

/**
 * Ordinally clockwise starting from UP=0
 */
export enum Direction {
	UP,
	RIGHT,
	DOWN,
	LEFT
}

export const DIRECTIONS = [
	Direction.UP,
	Direction.RIGHT,
	Direction.DOWN,
	Direction.LEFT
];
export const DIRECTION_MAP = {
	[Direction.UP]: { x: 0, y: -1 },
	[Direction.RIGHT]: { x: 1, y: 0 },
	[Direction.DOWN]: { x: 0, y: 1 },
	[Direction.LEFT]: { x: -1, y: 0 }
} as const;

export const moveDirection = (
	coord: Vector2d<number>,
	direction: Direction
): Vector2d => ({
	x: coord.x + DIRECTION_MAP[direction].x,
	y: coord.y + DIRECTION_MAP[direction].y
});

export const inBounds = (
	coord: Vector2d<number>,
	matrix: unknown[][]
): boolean =>
	coord.y >= 0 &&
	coord.y < matrix.length &&
	coord.x >= 0 &&
	coord.x < matrix[coord.y].length;

export const getPositionHashFunction =
	(matrix: unknown[][]): ((coord: Vector2d<number>) => number) =>
	(coord) =>
		coord.y * matrix[coord.y].length + coord.x;

export const printMatrix = <T>(
	matrix: T[][],
	separator: string = "",
	overwriteFn?: (coord: Vector2d, value: T) => unknown | undefined
): void => {
	for (let y = 0; y < matrix.length; y++) {
		console.log(
			matrix[y]
				.map(
					(cell, x) =>
						(overwriteFn && overwriteFn({ x, y }, cell)) || cell
				)
				.join(separator)
		);
	}
};

export const rref = (input: number[][]): number[][] => {
	const matrix = input.map(row => [...row]); // Deep copy
	const rowCount = matrix.length;
	const colCount = matrix[0]?.length ?? 0;
	let lead = 0;

	for (let r = 0; r < rowCount; r++) {
		if (lead >= colCount) break;

		let i = r;
		while (i < rowCount && Math.abs(matrix[i][lead]) < 1e-10) {
			i++;
		}
		if (i === rowCount) {
			lead++;
			r--;
			continue;
		}
		// Swap to current row
		if (i !== r) {
			[matrix[i], matrix[r]] = [matrix[r], matrix[i]];
		}
		// Normalize row to leading 1
		const lv = matrix[r][lead];
		for (let k = 0; k < colCount; k++) {
			matrix[r][k] = matrix[r][k] / lv;
		}
		// Eliminate other rows
		for (let i2 = 0; i2 < rowCount; i2++) {
			if (i2 !== r) {
				const lv2 = matrix[i2][lead];
				for (let k = 0; k < colCount; k++) {
					matrix[i2][k] -= lv2 * matrix[r][k];
				}
			}
		}
		lead++;
	}

	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const rounded = Math.round(matrix[y][x]);
			if (Math.abs(matrix[y][x] - rounded) < 0.1) {
				matrix[y][x] = rounded;
			} else {
				matrix[y][x] = parseFloat(matrix[y][x].toFixed(5));
			}
		}
	}

	// Remove trailing zero rows
	return matrix.filter(row => row.some(cell => Math.abs(cell) > 1e-10));
};


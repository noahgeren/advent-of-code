import { ZERO } from "#/utilities/constants";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 12)
	.toString()
	.split("\n")
	.map((row) => row.split(""));

const hash = (x: number, y: number) => y * data[0].length + x;

const seen = new Set<number>();
const findPrice = (
	x: number,
	y: number,
	expected: string,
	price: {
		area: number;
		perimeter: number;
		sides: number;
	}
): void => {
	if (seen.has(hash(x, y)) || data[y]?.[x] !== expected) {
		return;
	}
	seen.add(hash(x, y));
	price.area++;
	for (let dx = -1; dx <= 1; dx += 2) {
		if (data[y + dx]?.[x] !== expected) price.perimeter++;
		if (data[y]?.[x - dx] !== expected) price.perimeter++;
		for (let dy = -1; dy <= 1; dy += 2) {
			let count = 0;
			if (data[y]?.[x + dx] === expected) count++;
			if (data[y + dy]?.[x] === expected) count++;
			if (
				count === 0 ||
				(count === 2 && data[y + dy]?.[x + dx] !== expected)
			) {
				price.sides++;
			}
		}
	}
	findPrice(x, y - 1, expected, price);
	findPrice(x, y + 1, expected, price);
	findPrice(x - 1, y, expected, price);
	findPrice(x + 1, y, expected, price);
};

let totalPrice = [ZERO, ZERO];
for (let y = 0; y < data.length; y++) {
	for (let x = 0; x < data[y].length; x++) {
		const price = { area: 0, perimeter: 0, sides: 0 };
		findPrice(x, y, data[y][x], price);
		totalPrice[0] = totalPrice[0].plus(
			BigNumber(price.area).times(price.perimeter)
		);
		totalPrice[1] = totalPrice[1].plus(
			BigNumber(price.area).times(price.sides)
		);
	}
}

console.log(totalPrice.map((price) => price.toFixed()).join("\n"));

import { createCanvas } from "canvas";
import { createWriteStream } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2025, 9)
	.toString()
	.split("\n")
	.map((row) => {
		const [x, y] = row.split(",").map((n) => +n);
		return { x, y };
	});

interface Rectangle {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	area: number;
}
const rectangles: Rectangle[] = [];

const border: Partial<Record<number, Record<number, boolean>>> = {};
const canvas = createCanvas(100000, 100000, "pdf");
const ctx = canvas.getContext("2d");

for (let i = 0; i < data.length; i++) {
	const xDiff = data[i].x - data[(i + 1) % data.length].x;
	const yDiff = data[i].y - data[(i + 1) % data.length].y;

	ctx.beginPath();
	ctx.moveTo(data[i].x, data[i].y);
	ctx.lineTo(data[(i + 1) % data.length].x, data[(i + 1) % data.length].y);
	ctx.stroke();

	// console.log(`${i}/${data.length}`);
	// for (let j = 0; j < Math.abs(xDiff + yDiff); j++) {
	// 	const newX = data[i].x - Math.sign(xDiff) * j;
	// 	const newY = data[i].y - Math.sign(yDiff) * j;

	// 	if (border[newX]?.[newY]) {
	// 		console.log("Intersection!!!");
	// 	}

	// 	border[newX] = {
	// 		...border[newX],
	// 		[newY]: true
	// 	};
	// }

	for (let j = i + 1; j < data.length; j++) {
		const minX = Math.min(data[i].x, data[j].x);
		const minY = Math.min(data[i].y, data[j].y);
		const maxX = Math.max(data[i].x, data[j].x);
		const maxY = Math.max(data[i].y, data[j].y);

		const area = (maxX - minX + 1) * (maxY - minY + 1);

		rectangles.push({ minX, minY, maxX, maxY, area });
	}
}

rectangles.sort((a, b) => b.area - a.area);

console.log("Part 1:", rectangles[0].area);

const isRectangleContained = (rect: Rectangle): boolean => {
	return (
		(rect.maxY <= 50000 || rect.minY >= 50000) &&
		data.every((tile) => {
			return (
				tile.x <= rect.minX ||
				tile.x >= rect.maxX ||
				tile.y <= rect.minY ||
				tile.y >= rect.maxY
			);
		})
	);
};

const maxContained = rectangles.find(isRectangleContained)!;
console.log("Part 2:", maxContained?.area);

ctx.strokeStyle = "red";
ctx.strokeRect(
	maxContained.minX,
	maxContained.minY,
	maxContained.maxX - maxContained.minX,
	maxContained.maxY - maxContained.minY
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const out = createWriteStream(__dirname + "/map.pdf");
const stream = canvas.createPDFStream();
stream.pipe(out);
out.on("finish", () => console.log("The PDF file was created."));

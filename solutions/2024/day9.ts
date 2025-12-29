import { ZERO } from "#/utilities/constants";
import BigNumber from "bignumber.js";
import { readInputFile } from "#/utilities/general";

const data = readInputFile(2024, 9)
	.toString()
	.split("")
	.map((n) => +n);

let id = 0;
let block: number[] = [];
let file = true;
data.forEach((n) => {
	if (file) {
		block.push(...Array(n).fill(id++));
	} else {
		block.push(...Array(n).fill(-1));
	}
	file = !file;
});

let last = block.length - 1;
let newBlock = [...block];
for (let i = 0; i < last; i++) {
	if (newBlock[i] > -1) continue;
	for (let j = last; j > i; j--) {
		if (newBlock[j] > -1) {
			newBlock[i] = newBlock[j];
			newBlock[j] = -1;
			last = j - 1;
			break;
		}
	}
}

let checksum = ZERO;
for (let i = 0; i < newBlock.length && newBlock[i] > -1; i++) {
	checksum = checksum.plus(BigNumber(i).times(newBlock[i]));
}

console.log(checksum.toFixed());

newBlock = [];
let files: (number | number[])[] = data.map((n, idx) =>
	idx % 2 === 0 ? Array(n).fill(idx / 2) : n
);

for (let i = files.length - 1; i >= 0; i--) {
	const last = files[i];
	if (!Array.isArray(last)) continue;
	for (let j = 0; j < i; j++) {
		const first = files[j];
		if (Array.isArray(first)) continue;
		if (first >= last.length) {
			let newEmpty = files[i - 1];
			if (!Array.isArray(newEmpty)) {
				files[i - 1] = newEmpty + last.length;
			}
			files[j] = first - last.length;
			files.splice(i, 1);
			files.splice(j, 0, last);
			break;
		}
	}
}

newBlock = files.flatMap((file) =>
	Array.isArray(file) ? file : Array(file).fill(-1)
);

checksum = ZERO;
for (let i = 0; i < newBlock.length; i++) {
	if (newBlock[i] > -1) {
		checksum = checksum.plus(BigNumber(i).times(newBlock[i]));
	}
}
console.log(checksum.toFixed());

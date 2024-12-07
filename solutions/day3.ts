import { BigNumber } from "bignumber.js";
import { readFileSync } from "node:fs";

let data = readFileSync("./data/day3.txt").toString();

console.log(
  [...data.matchAll(/mul\((\d+),(\d+)\)/g)]
    .reduce(
      (a, b) => a.plus(BigNumber(b.at(1)!).times(+b.at(2)!)),
      BigNumber(0)
    )
    .toFixed()
);

let total = BigNumber(0);
let enabled = true;
[...data.matchAll(/(?:mul\((\d+),(\d+)\))|(do\(\))|(don't\(\))/g)].forEach(
  (m) => {
    let match = [...m];
    if (match[3] === "do()") {
      enabled = true;
    } else if (match[4] === "don't()") {
      enabled = false;
    } else if (enabled) {
      total = total.plus(BigNumber(match[1]).times(match[2]));
    }
  }
);
console.log(total.toFixed());
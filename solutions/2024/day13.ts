import { ZERO } from "#/utilities/constants";
import { Vector2d } from "#/utilities/matrix";
import BigNumber from "bignumber.js";
import console from "console";
import { readInputFile } from "#/utilities/general";

const blocks = readInputFile(2024, 13)
	.toString()
	.split("\n\n")
	.map((block) => {
		const lines = block.split("\n");
		const buttonA = lines[0]
			.split(",")
			.map((token) => BigNumber(token.split("+")[1]));
		const buttonB = lines[1]
			.split(",")
			.map((token) => BigNumber(token.split("+")[1]));
		const prize = lines[2]
			.split(",")
			.map((token) => BigNumber(token.split("=")[1]));

		return {
			a: { x: buttonA[0], y: buttonA[1] },
			b: { x: buttonB[0], y: buttonB[1] },
			p: { x: prize[0], y: prize[1] }
		};
	});

const A_PRICE = BigNumber(3),
	PRIZE_DIFF = BigNumber("10000000000000");

const findTokensToWin = (
	a: Vector2d<BigNumber>,
	b: Vector2d<BigNumber>,
	p: Vector2d<BigNumber>
): BigNumber => {
	const bN = a.x.times(p.y).minus(a.y.times(p.x)),
		bD = a.x.times(b.y).minus(a.y.times(b.x));
	if (!bN.mod(bD).isZero()) {
		return ZERO;
	}
	const aN = b.x.times(p.y).minus(b.y.times(p.x)),
		aD = b.x.times(a.y).minus(b.y.times(a.x));
	if (!aN.mod(aD).isZero()) {
		return ZERO;
	}
	return aN.dividedBy(aD).times(A_PRICE).plus(bN.dividedBy(bD));
};

const fewestTokens = [ZERO, ZERO];
blocks.forEach((block) => {
	fewestTokens[0] = fewestTokens[0].plus(
		findTokensToWin(block.a, block.b, block.p)
	);

	fewestTokens[1] = fewestTokens[1].plus(
		findTokensToWin(block.a, block.b, {
			x: block.p.x.plus(PRIZE_DIFF),
			y: block.p.y.plus(PRIZE_DIFF)
		})
	);
});

console.log(fewestTokens.map((num) => num.toFixed()).join("\n"));

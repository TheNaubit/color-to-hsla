import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { colorToHSLA, hslaToString } from "./index.js";

// Every README example written as a call followed by a `// <result>` (or `// Throws: <message>`) comment is run and checked, so the docs can not drift from the code.

interface IExample {
	code: string;
	expected: string;
}

const README = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const CODE_BLOCK_REGEX = /~~~ts\n([\s\S]*?)~~~/g;
const CALL_REGEX = /^(colorToHSLA|hslaToString)\(/;

function examplesOf(block: string): Array<IExample> {
	const examples: Array<IExample> = [];
	let pending: Array<string> = [];

	for (const line of block.split("\n")) {
		const expectation = /^\/\/ (.+)$/.exec(line.trim());
		const code = pending.join("\n").trim();

		if (expectation && CALL_REGEX.test(code) && code.endsWith(");")) {
			examples.push({ code, expected: expectation[1] as string });
			pending = [];
		} else if (CALL_REGEX.test(line) || pending.length > 0) {
			pending = expectation ? [] : [...pending, line];
		}
	}

	return examples;
}

// The code and the expected values come from this repository's own README (trusted content), and this only runs in the test suite
function evaluate(code: string): unknown {
	return new Function(
		"colorToHSLA",
		"hslaToString",
		`return ${code.replace(/;\s*$/, "")};`,
	)(colorToHSLA, hslaToString);
}

const examples = [...README.matchAll(CODE_BLOCK_REGEX)].flatMap((match) =>
	examplesOf(match[1] as string),
);

describe("README examples", () => {
	it("has examples to check", () => {
		expect(examples.length).toBeGreaterThan(20);
	});

	it.each(examples)("$code", ({ code, expected }) => {
		const thrownMessage = /^Throws: (.+)$/.exec(expected)?.[1];

		if (thrownMessage !== undefined) {
			expect(() => evaluate(code)).toThrow(thrownMessage);
		} else {
			expect(evaluate(code)).toEqual(evaluate(expected));
		}
	});
});

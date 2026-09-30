import { describe, expect, it } from "vitest";
import { colorToHSLA, hslaToString } from "./index.js";

const RED = { h: 0, s: 1, l: 0.5, a: 1 };
const INVALID = { h: 0, s: 0, l: 0, a: 0 };

describe("performance", () => {
	it("parses long numbers in linear time", () => {
		const start = performance.now();
		colorToHSLA(`hsl(${"1".repeat(100_000)}x 50% 50%)`);
		colorToHSLA(`rgb(${"1".repeat(100_000)}x, 0, 0)`);
		expect(performance.now() - start).toBeLessThan(500);
	});
});

describe("CSS whitespace", () => {
	it("accepts newlines, carriage returns and form feeds", () => {
		expect(colorToHSLA("rgb(255,\n0,\n0)")).toEqual(RED);
		expect(colorToHSLA("rgb(255\n0\r\n0)")).toEqual(RED);
		expect(colorToHSLA("\n\f red \t")).toEqual(RED);
	});

	it("rejects other whitespace", () => {
		expect(colorToHSLA("rgb(255 0 0)")).toEqual(INVALID);
		expect(colorToHSLA("﻿red")).toEqual(INVALID);
		expect(colorToHSLA(" #f00")).toEqual(INVALID);
	});
});

describe("numbers", () => {
	it("maps infinite hues to 0", () => {
		expect(colorToHSLA("hsl(1e999 50% 50%)")).toEqual({
			h: 0,
			s: 0.5,
			l: 0.5,
			a: 1,
		});
		expect(colorToHSLA("hsl(1e308turn 50% 50%)").h).toBe(0);
	});

	it("rejects numbers with a trailing dot", () => {
		expect(colorToHSLA("rgb(1., 0, 0)")).toEqual(INVALID);
		expect(colorToHSLA("rgb(1.e2 0 0)")).toEqual(INVALID);
		expect(colorToHSLA("hsl(1.deg 50% 50%)")).toEqual(INVALID);
	});

	it("rejects mixed numbers and percentages in the legacy syntax", () => {
		expect(colorToHSLA("rgb(100%, 0, 0)")).toEqual(INVALID);
		expect(colorToHSLA("rgb(255, 0%, 0)")).toEqual(INVALID);
		expect(colorToHSLA("rgb(100% 0 0)")).toEqual(RED);
	});
});

describe("named colors", () => {
	it("does not treat object members as colors", () => {
		expect(colorToHSLA("constructor")).toEqual(INVALID);
		expect(colorToHSLA("__proto__")).toEqual(INVALID);
		expect(colorToHSLA("toString")).toEqual(INVALID);
	});
});

describe("objects", () => {
	it("ignores keys set to undefined", () => {
		expect(colorToHSLA({ r: 255, g: 0, b: 0, a: undefined })).toEqual(RED);
		expect(colorToHSLA({ r: 255, g: 0, b: 0, h: undefined })).toEqual(RED);
	});

	it("throws on mixed HSL and RGB keys", () => {
		expect(() =>
			// @ts-expect-error: mixed keys on purpose (plain JavaScript callers)
			colorToHSLA({ h: 0, s: 1, l: 0.5, r: 255 }),
		).toThrow("Can not mix hsl and rgb keys");
	});
});

describe("hslaToString rounding", () => {
	it("rounds the decimal value, not its binary approximation", () => {
		expect(hslaToString({ h: 0, s: 0.285, l: 0.5, a: 0.0045 })).toBe(
			"hsla(0, 29%, 50%, 0.005)",
		);
	});
});

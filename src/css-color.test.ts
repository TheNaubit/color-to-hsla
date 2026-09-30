import { describe, expect, it } from "vitest";
import { colorToHSLA, hslaToString } from "./index.js";

const RED = { h: 0, s: 1, l: 0.5, a: 1 };
const HALF_RED = { h: 0, s: 1, l: 0.5, a: 0.5 };
const INVALID = { h: 0, s: 0, l: 0, a: 0 };

describe("hex colors", () => {
	it.each([
		["#f00", RED],
		["#F00", RED],
		["#ff0000", RED],
		["#f008", { ...RED, a: 0.5333333333 }],
		["#ff000080", { ...RED, a: 0.5019607843 }],
		["#ff0000ff", RED],
		["#ff00", { h: 60, s: 1, l: 0.5, a: 0 }],
	])("parses %s", (input, expected) => {
		expect(colorToHSLA(input)).toEqual(expected);
	});

	it.each([["#ff000"], ["#ff00000"], ["#ggg"], ["ff0000"], ["#"]])(
		"rejects %s",
		(input) => {
			expect(colorToHSLA(input)).toEqual(INVALID);
		},
	);
});

describe("rgb() and rgba()", () => {
	it.each([
		["rgb(255, 0, 0)", RED],
		["rgb(255 0 0)", RED],
		["rgb(255.4, 0, 0)", RED],
		["rgb(100%, 0%, 0%)", RED],
		["rgb(100% 0% 0%)", RED],
		["rgb(255 0 0 / 50%)", HALF_RED],
		["rgb(255 0 0 / 0.5)", HALF_RED],
		["rgb(255, 0, 0, 0.5)", HALF_RED],
		["rgba(255, 0, 0, 0.5)", HALF_RED],
		["rgba(255, 0, 0, 50%)", HALF_RED],
		["rgba(255 0 0 / .5)", HALF_RED],
		["rgba(255, 0, 0)", RED],
		["RGB( 255 , 0 , 0 )", RED],
		["rgb(255 none none)", RED],
		["rgb(1e2% 0 0)", RED],
	])("parses %s", (input, expected) => {
		expect(colorToHSLA(input)).toEqual(expected);
	});

	it("clamps channels and alpha", () => {
		expect(colorToHSLA("rgb(300, -20, 0)")).toEqual(RED);
		expect(colorToHSLA("rgba(255, 0, 0, 5)")).toEqual(RED);
		expect(colorToHSLA("rgba(255, 0, 0, -1)")).toEqual({ ...RED, a: 0 });
	});

	it.each([
		["rgba(255, 0, 0, 1.2.3)"],
		["rgb(255, 0)"],
		["rgb(255, 0, 0, 0, 0)"],
		["rgb(255 0, 0)"],
		["rgb(255, 0, 0 / 0.5)"],
		["rgb(255 0 0 /)"],
		["rgb()"],
		["rgb(a, b, c)"],
	])("rejects %s", (input) => {
		expect(colorToHSLA(input)).toEqual(INVALID);
	});
});

describe("hsl() and hsla()", () => {
	it.each([
		["hsl(120, 50%, 50%)", { h: 120, s: 0.5, l: 0.5, a: 1 }],
		["hsl(120 50% 50%)", { h: 120, s: 0.5, l: 0.5, a: 1 }],
		["hsl(120deg 50% 50%)", { h: 120, s: 0.5, l: 0.5, a: 1 }],
		["hsl(0.5turn 50% 50%)", { h: 180, s: 0.5, l: 0.5, a: 1 }],
		["hsl(200grad 50% 50%)", { h: 180, s: 0.5, l: 0.5, a: 1 }],
		["hsl(3.14159265rad 50% 50%)", { h: 180, s: 0.5, l: 0.5, a: 1 }],
		["hsl(120.7, 50%, 50%)", { h: 121, s: 0.5, l: 0.5, a: 1 }],
		["hsl(-120, 50%, 50%)", { h: 240, s: 0.5, l: 0.5, a: 1 }],
		["hsl(480, 50%, 50%)", { h: 120, s: 0.5, l: 0.5, a: 1 }],
		["hsl(360, 50%, 50%)", { h: 0, s: 0.5, l: 0.5, a: 1 }],
		["hsl(120 50 50)", { h: 120, s: 0.5, l: 0.5, a: 1 }],
		["hsl(120 50% 50% / 25%)", { h: 120, s: 0.5, l: 0.5, a: 0.25 }],
		["hsla(120, 50%, 50%, 0.25)", { h: 120, s: 0.5, l: 0.5, a: 0.25 }],
		["hsla(120, 50%, 50%)", { h: 120, s: 0.5, l: 0.5, a: 1 }],
		["hsl(none 50% 50%)", { h: 0, s: 0.5, l: 0.5, a: 1 }],
	])("parses %s", (input, expected) => {
		expect(colorToHSLA(input)).toEqual(expected);
	});

	it("clamps saturation, lightness and alpha", () => {
		expect(colorToHSLA("hsl(120, 150%, -10%)")).toEqual({
			h: 120,
			s: 1,
			l: 0,
			a: 1,
		});
		expect(colorToHSLA("hsla(120, 50%, 50%, 2)")).toEqual({
			h: 120,
			s: 0.5,
			l: 0.5,
			a: 1,
		});
	});

	it.each([["hsl(120, 50, 50)"], ["hsl(120px, 50%, 50%)"], ["hsl(120, 50%)"]])(
		"rejects %s",
		(input) => {
			expect(colorToHSLA(input)).toEqual(INVALID);
		},
	);
});

describe("named colors and keywords", () => {
	it("supports every CSS named color", () => {
		expect(colorToHSLA("rebeccapurple")).toEqual({
			h: 270,
			s: 0.5,
			l: 0.4,
			a: 1,
		});
		expect(colorToHSLA("  RED  ")).toEqual(RED);
	});

	it("supports transparent", () => {
		expect(colorToHSLA("transparent")).toEqual({ h: 0, s: 0, l: 0, a: 0 });
	});

	it("removes floating point noise", () => {
		expect(colorToHSLA("azure")).toEqual({
			h: 180,
			s: 1,
			l: 0.9705882353,
			a: 1,
		});
	});
});

describe("objects", () => {
	it("accepts complete HSL and RGB objects", () => {
		expect(colorToHSLA({ h: 120, s: 0.5, l: 0.5 })).toEqual({
			h: 120,
			s: 0.5,
			l: 0.5,
			a: 1,
		});
		expect(colorToHSLA({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual(HALF_RED);
	});

	it("normalizes and clamps object values", () => {
		expect(colorToHSLA({ h: -30, s: 2, l: 0.5, a: 3 })).toEqual({
			h: 330,
			s: 1,
			l: 0.5,
			a: 1,
		});
		expect(colorToHSLA({ r: 300, g: 0, b: 0 })).toEqual(RED);
	});

	it("throws on partial objects", () => {
		// @ts-expect-error: partial object on purpose
		expect(() => colorToHSLA({ h: 120 })).toThrow(
			'Missing key "s" in color type hsl',
		);
		// @ts-expect-error: partial object on purpose
		expect(() => colorToHSLA({ r: 255 })).toThrow(
			'Missing key "g" in color type rgb',
		);
	});

	it("throws on non-numeric values", () => {
		expect(() =>
			// @ts-expect-error: invalid value on purpose (plain JavaScript callers)
			colorToHSLA({ h: "120", s: 0.5, l: 0.5 }),
		).toThrow('Invalid value for key "h"');
		expect(() => colorToHSLA({ r: Number.NaN, g: 0, b: 0 })).toThrow(
			'Invalid value for key "r"',
		);
	});

	it("throws on invalid arguments", () => {
		// @ts-expect-error: invalid argument on purpose (plain JavaScript callers)
		expect(() => colorToHSLA(null)).toThrow("Must pass string or object");
		// @ts-expect-error: invalid argument on purpose (plain JavaScript callers)
		expect(() => colorToHSLA(42)).toThrow("Must pass string or object");
		// @ts-expect-error: partial object on purpose
		expect(() => colorToHSLA({})).toThrow("Could not parse argument");
	});
});

describe("hslaToString", () => {
	it("keeps up to three alpha decimals", () => {
		expect(hslaToString({ h: 120, s: 0.5, l: 0.5, a: 0.05 })).toBe(
			"hsla(120, 50%, 50%, 0.05)",
		);
		expect(hslaToString({ h: 120, s: 0.5, l: 0.5, a: 0.25 })).toBe(
			"hsla(120, 50%, 50%, 0.25)",
		);
	});

	it("wraps the hue", () => {
		expect(hslaToString({ h: -30, s: 0.5, l: 0.5, a: 1 })).toBe(
			"hsla(330, 50%, 50%, 1)",
		);
		expect(hslaToString({ h: 390, s: 0.5, l: 0.5, a: 1 })).toBe(
			"hsla(30, 50%, 50%, 1)",
		);
		expect(hslaToString({ h: 360, s: 0.5, l: 0.5, a: 1 })).toBe(
			"hsla(0, 50%, 50%, 1)",
		);
	});

	it("round-trips with colorToHSLA", () => {
		const hsla = colorToHSLA("hsla(200, 40%, 30%, 0.125)");
		expect(colorToHSLA(hslaToString(hsla))).toEqual(hsla);
	});
});

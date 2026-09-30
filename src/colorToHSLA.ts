import { clamp, hsla, normalizeHue, rgbaToHsla, round } from "./lib/convert.js";
import {
	parseAlpha,
	parseChannel,
	parseCSSFunction,
	parseHex,
	parseHslPercentage,
	parseHue,
	trimCSS,
} from "./lib/css.js";
import colors from "./lib/named.js";
import type { HSLA, IColorObject } from "./types.js";

// Returned for strings that are not a valid color
const DEFAULT_HSLA_COLOR: Readonly<HSLA> = Object.freeze({
	h: 0,
	s: 0,
	l: 0,
	a: 0,
});

const HSL_KEYS = ["h", "s", "l"] as const;
const RGB_KEYS = ["r", "g", "b"] as const;

/**
 * Converts a color value to HSLA format.
 *
 * Strings accept every CSS syntax of hex colors (`#f00`, `#f008`, `#ff0000`, `#ff000080`), `rgb()`, `rgba()`, `hsl()` and `hsla()` (legacy comma-separated and modern space-separated, with `/ alpha`), named colors and `transparent`.
 * Objects are `{ h, s, l, a? }` (saturation and lightness between 0 and 1) or `{ r, g, b, a? }` (channels between 0 and 255).
 *
 * @param format - The color value to convert. It can be either a string or an object.
 * @returns The color in HSLA format: the hue is an integer between 0 and 359, the saturation, the lightness and the alpha are between 0 and 1. Strings that are not a valid color return `{ h: 0, s: 0, l: 0, a: 0 }`.
 * @throws Error if the format is not a string or an object, or if the object is not a complete HSL or RGB color.
 */
export default function colorToHsla(format: string | IColorObject): HSLA {
	if (typeof format === "string") return parseString(format);
	if (typeof format !== "object" || format === null) {
		throw new Error("Must pass string or object");
	}

	// Values can come from JavaScript callers: every key is checked at runtime
	const color: Record<string, unknown> = { ...format };
	const alpha = format.a == null ? 1 : numberOf(color, "a");
	// Keys set to undefined (spreads of optional properties) are ignored
	const isHsl = HSL_KEYS.some((key) => color[key] !== undefined);
	const isRgb = RGB_KEYS.some((key) => color[key] !== undefined);

	if (isHsl && isRgb) throw new Error("Can not mix hsl and rgb keys");

	if (isHsl) {
		const [h, s, l] = HSL_KEYS.map((key) => requiredNumber(color, key, "hsl"));
		return hsla(h as number, s as number, l as number, alpha);
	}

	if (isRgb) {
		const [r, g, b] = RGB_KEYS.map((key) => requiredNumber(color, key, "rgb"));
		return rgbaToHsla(r as number, g as number, b as number, alpha);
	}

	throw new Error("Could not parse argument");
}

function numberOf(color: Record<string, unknown>, key: string): number {
	const value = color[key];
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error(`Invalid value for key "${key}"`);
	}
	return value;
}

function requiredNumber(
	color: Record<string, unknown>,
	key: string,
	type: string,
): number {
	if (color[key] === undefined) {
		throw new Error(`Missing key "${key}" in color type ${type}`);
	}
	return numberOf(color, key);
}

/**
 * Parses a string representation of a color and converts it to HSLA format.
 *
 * @param value - The string representation of the color.
 * @returns The color in HSLA format, or the default HSLA color if the string can not be parsed.
 */
function parseString(value: string): HSLA {
	const color = trimCSS(value).toLowerCase();

	const hex = parseHex(color);
	if (hex) return rgbaToHsla(...hex);

	// Own keys only: "constructor" or "__proto__" are not colors
	const named = Object.hasOwn(colors, color) ? colors[color] : undefined;
	if (named !== undefined) {
		return rgbaToHsla(
			(named >> 16) & 0xff,
			(named >> 8) & 0xff,
			named & 0xff,
			1,
		);
	}

	if (color === "transparent") return rgbaToHsla(0, 0, 0, 0);

	const parsed = parseCSSFunction(color);
	if (!parsed) return { ...DEFAULT_HSLA_COLOR };

	const { name, components, alpha, modern } = parsed;
	const parsedAlpha = parseAlpha(alpha, modern);

	if (name === "rgb") {
		// The legacy syntax does not mix numbers and percentages ("rgb(100%, 0, 0)")
		const percentages = components.filter((component) =>
			component.endsWith("%"),
		);
		if (!modern && percentages.length !== 0 && percentages.length !== 3) {
			return { ...DEFAULT_HSLA_COLOR };
		}

		const [r, g, b] = components.map((component) =>
			parseChannel(component, modern),
		);
		return r == null || g == null || b == null || parsedAlpha === null
			? { ...DEFAULT_HSLA_COLOR }
			: rgbaToHsla(r, g, b, parsedAlpha);
	}

	const h = parseHue(components[0], modern);
	const s = parseHslPercentage(components[1], modern);
	const l = parseHslPercentage(components[2], modern);
	return h === null || s === null || l === null || parsedAlpha === null
		? { ...DEFAULT_HSLA_COLOR }
		: hsla(h, s, l, parsedAlpha);
}

/**
 * Converts an HSLA color object to a CSS string (`hsla(h, s%, l%, a)`).
 * The hue wraps around, the saturation and the lightness are rounded percentages and the alpha keeps up to three decimals.
 *
 * @param color - The HSLA color object to convert.
 * @returns The CSS string of the HSLA color.
 * @example
 * hslaToString({ h: 120, s: 0.5, l: 0.5, a: 0.25 }); // "hsla(120, 50%, 50%, 0.25)"
 */
export function hslaToString(color: HSLA): string {
	const finite = (value: number): number =>
		Number.isFinite(value) ? value : 0;
	const h = normalizeHue(finite(color.h));
	// Rounded after removing floating point noise: 0.285 * 100 is 28.499999999999996, but it is 28.5 (29%)
	const s = Math.round(round(clamp(finite(color.s), 0, 1) * 100));
	const l = Math.round(round(clamp(finite(color.l), 0, 1) * 100));
	const a = Math.round(round(clamp(finite(color.a), 0, 1) * 1000)) / 1000;

	return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

import type { HSLA } from "../types.js";

// Rounding to 10 decimals removes floating point noise (0.49999999999999994) without losing meaningful precision
const PRECISION = 1e10;

export function round(value: number): number {
	return Math.round(value * PRECISION) / PRECISION;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Normalizes a hue to an integer between 0 and 359 (hues wrap around: -30 is 330, 480 is 120).
 */
export function normalizeHue(hue: number): number {
	const rounded = Math.round(((hue % 360) + 360) % 360);
	return rounded === 360 ? 0 : rounded;
}

/**
 * Builds a normalized HSLA color: the hue wraps around, and the saturation, the lightness and the alpha are clamped between 0 and 1.
 */
export function hsla(h: number, s: number, l: number, a: number): HSLA {
	return {
		h: normalizeHue(h),
		s: round(clamp(s, 0, 1)),
		l: round(clamp(l, 0, 1)),
		a: round(clamp(a, 0, 1)),
	};
}

/**
 * Converts an RGBA color (channels between 0 and 255, clamped) to a normalized HSLA color.
 */
export function rgbaToHsla(
	red: number,
	green: number,
	blue: number,
	alpha: number,
): HSLA {
	const r = clamp(red, 0, 255) / 255;
	const g = clamp(green, 0, 255) / 255;
	const b = clamp(blue, 0, 255) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const chroma = max - min;
	const l = (max + min) / 2;

	// Grays have no hue and no saturation
	if (chroma === 0) return hsla(0, 0, l, alpha);

	const s = chroma / (1 - Math.abs(2 * l - 1));
	const h =
		max === r
			? ((g - b) / chroma) % 6
			: max === g
				? (b - r) / chroma + 2
				: (r - g) / chroma + 4;

	return hsla(h * 60, s, l, alpha);
}

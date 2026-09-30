// A CSS <number>: "12", "-1.5", ".5", "1e2"
const NUMBER = "[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?";
const NUMBER_REGEX = new RegExp(`^${NUMBER}$`, "i");
const PERCENTAGE_REGEX = new RegExp(`^(${NUMBER})%$`, "i");
const ANGLE_REGEX = new RegExp(`^(${NUMBER})(deg|grad|rad|turn)?$`, "i");
const FUNCTION_REGEX = /^(rgba?|hsla?)\((.*)\)$/i;
const HEX_REGEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

// Degrees in one unit of each angle unit
const DEGREES_PER_UNIT: Record<string, number> = {
	deg: 1,
	grad: 360 / 400,
	rad: 180 / Math.PI,
	turn: 360,
};

export interface ICSSFunction {
	name: "rgb" | "hsl";
	// The three color components
	components: [string, string, string];
	// The alpha component, when present
	alpha: string | null;
	// The modern syntax (space separated) allows "none" and numbers for percentages
	modern: boolean;
}

/**
 * Splits a CSS color function into its components. Both syntaxes are supported:
 * the legacy one ("rgb(255, 0, 0)", "rgba(255, 0, 0, 0.5)", "rgb(255, 0, 0, 0.5)")
 * and the modern one ("rgb(255 0 0)", "rgb(255 0 0 / 50%)").
 *
 * @returns The components, or null if the string is not a valid rgb(), rgba(), hsl() or hsla() function.
 */
export function parseCSSFunction(value: string): ICSSFunction | null {
	const match = FUNCTION_REGEX.exec(value);
	if (!match) return null;

	const name = (match[1] as string).toLowerCase().startsWith("rgb")
		? "rgb"
		: "hsl";
	const inner = (match[2] as string).trim();

	if (inner.includes(",")) {
		// The legacy syntax has no "/" and 3 or 4 comma-separated components
		const parts = inner.split(",").map((part) => part.trim());
		if (
			inner.includes("/") ||
			parts.length < 3 ||
			parts.length > 4 ||
			parts.some((part) => part === "" || /\s/.test(part))
		) {
			return null;
		}
		return {
			name,
			components: [parts[0], parts[1], parts[2]] as [string, string, string],
			alpha: parts[3] ?? null,
			modern: false,
		};
	}

	const [main = "", alpha, ...extra] = inner.split("/");
	const components = main.trim().split(/\s+/);
	const alphaValue = alpha?.trim();
	if (
		extra.length > 0 ||
		components.length !== 3 ||
		alphaValue === "" ||
		/\s/.test(alphaValue ?? "")
	) {
		return null;
	}

	return {
		name,
		components: components as [string, string, string],
		alpha: alphaValue ?? null,
		modern: true,
	};
}

/**
 * Parses a <number>, or "none" (0) in the modern syntax.
 */
export function parseNumber(value: string, modern: boolean): number | null {
	if (modern && value.toLowerCase() === "none") return 0;
	return NUMBER_REGEX.test(value) ? Number(value) : null;
}

/**
 * Parses a <percentage> as a fraction ("50%" is 0.5), or "none" (0) in the modern syntax.
 */
export function parsePercentage(value: string, modern: boolean): number | null {
	if (modern && value.toLowerCase() === "none") return 0;
	const match = PERCENTAGE_REGEX.exec(value);
	return match ? Number(match[1]) / 100 : null;
}

/**
 * Parses an RGB channel: a number between 0 and 255 or a percentage.
 */
export function parseChannel(value: string, modern: boolean): number | null {
	const percentage = parsePercentage(value, modern);
	return percentage !== null ? percentage * 255 : parseNumber(value, modern);
}

/**
 * Parses an alpha value: a number between 0 and 1 or a percentage (1 when missing).
 */
export function parseAlpha(
	value: string | null,
	modern: boolean,
): number | null {
	if (value === null) return 1;
	return parsePercentage(value, modern) ?? parseNumber(value, modern);
}

/**
 * Parses a hue in degrees: a number or an angle ("120deg", "0.5turn", "200grad", "3.14rad").
 */
export function parseHue(value: string, modern: boolean): number | null {
	if (modern && value.toLowerCase() === "none") return 0;
	const match = ANGLE_REGEX.exec(value);
	if (!match) return null;
	const unit = (match[2] ?? "deg").toLowerCase();
	return Number(match[1]) * (DEGREES_PER_UNIT[unit] as number);
}

/**
 * Parses the saturation or the lightness of hsl() as a fraction: a percentage, or a number in the modern syntax ("50" is 50%).
 */
export function parseHslPercentage(
	value: string,
	modern: boolean,
): number | null {
	const percentage = parsePercentage(value, modern);
	if (percentage !== null || !modern) return percentage;
	const number = parseNumber(value, modern);
	return number === null ? null : number / 100;
}

/**
 * Parses a hex color ("#f00", "#f008", "#ff0000", "#ff000080").
 *
 * @returns The red, green and blue channels (0-255) and the alpha (0-1), or null if it is not a valid hex color.
 */
export function parseHex(
	value: string,
): [number, number, number, number] | null {
	const match = HEX_REGEX.exec(value);
	if (!match) return null;

	const digits = match[1] as string;
	// Short forms repeat each digit: "#f08" is "#ff0088"
	const full =
		digits.length <= 4
			? digits
					.split("")
					.map((digit) => digit + digit)
					.join("")
			: digits;
	const [r, g, b, a = 255] = (full.match(/../g) as Array<string>).map((pair) =>
		Number.parseInt(pair, 16),
	);

	return [r as number, g as number, b as number, a / 255];
}

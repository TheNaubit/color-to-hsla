import {
  reHex3,
  reHex6,
  reHslPercent,
  reHslaPercent,
  reRgbInteger,
  reRgbPercent,
  reRgbaInteger,
  reRgbaPercent
} from "./lib/regexps";
import colors from "./lib/named";
import type { HSLA, IColorObject } from "./types";

const DEFAULT_HSLA_COLOR = { h: 0, s: 0, l: 0, a: 0 };

/**
 * Converts a color value to HSLA format.
 *
 * @param format - The color value to convert. It can be either a string or an object.
 * @returns The color value in HSLA format.
 * @throws Error if the format is not a string or an object, or if the argument cannot be parsed.
 */
export default function colorToHsla(format: string | IColorObject): HSLA {
  if (typeof format === "string") return parseString(format);
  if (typeof format !== "object") throw new Error("Must pass string or object");
  const a = format.a == null ? 1 : format.a;
  if (has(format, "hsl"))
    return hsla(format?.h ?? 0, format?.s ?? 0, format?.l ?? 0, a);
  if (has(format, "rgb"))
    return rgbaToHsla(format?.r ?? 0, format?.g ?? 0, format?.b ?? 0, a);
  throw new Error("Could not parse argument");
}

/**
 * Checks if the given object has the specified type.
 *
 * @param obj - The object to check.
 * @param type - The type to check for.
 * @returns A boolean indicating whether the object has the specified type.
 * @throws {Error} If a key is missing in the color type.
 */
function has(obj: IColorObject, type: string) {
  const keys = type.split("");
  let isType: boolean = false;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof key !== "undefined" && key in obj) {
      isType = true;
    } else if (typeof key === "undefined" && isType) {
      throw new Error('Missing key "' + key + '" in color type ' + type);
    }
  }
  return isType;
}

/**
 * Parses a string representation of a color and converts it to HSLA format.
 * Supports various color formats including HSL, HSLA, HEX, RGB, RGBA, and named colors.
 * If the string cannot be parsed, it returns the default HSLA color.
 *
 * @param string - The string representation of the color.
 * @returns The parsed color in HSLA format.
 */
function parseString(string: string): HSLA {
  try {
    string = `${string}`.trim().toLowerCase();

    // Detect HSL and convert to HSLA
    // Example: hsl(120, 50%, 50%) => hsla(120, 50%, 50%, 1)
    const reHslPercentResult = reHslPercent.exec(string);
    if (reHslPercentResult) {
      const v1 =
        reHslPercentResult.length >= 2
          ? Math.round(parseInt(reHslPercentResult[1] ?? "0", 10))
          : 0;

      const v2 =
        reHslPercentResult.length >= 3
          ? parseFloat(reHslPercentResult[2] ?? "0")
          : 0;

      const v3 =
        reHslPercentResult.length >= 4
          ? parseFloat(reHslPercentResult[3] ?? "0")
          : 0;
      return hsla(v1, v2 / 100, v3 / 100, 1);
    }

    // Detect HSLA and convert to HSLA
    // Example: hsla(120, 50%, 50%, 1) => hsla(120, 50%, 50%, 1)
    const reHslaPercentResult = reHslaPercent.exec(string);
    if (reHslaPercentResult) {
      const v1 =
        reHslaPercentResult.length >= 2
          ? Math.round(parseInt(reHslaPercentResult[1] ?? "0", 10))
          : 0;

      const v2 =
        reHslaPercentResult.length >= 3
          ? parseFloat(reHslaPercentResult[2] ?? "0")
          : 0;

      const v3 =
        reHslaPercentResult.length >= 4
          ? parseFloat(reHslaPercentResult[3] ?? "0")
          : 0;

      const v4 =
        reHslaPercentResult.length >= 5
          ? parseFloat(reHslaPercentResult[4] ?? "0")
          : 0;
      return hsla(v1, v2 / 100, v3 / 100, v4);
    }

    // Detect HEX3 and convert to HSLA
    // Example: #f00 => hsla(0, 100%, 50%, 1)
    const reHex3Result = reHex3.exec(string);
    if (reHex3Result) {
      const v1 = parseInt(reHex3Result[1] ?? "0", 16);
      return rgbaToHsla(
        ((v1 >> 8) & 0xf) | ((v1 >> 4) & 0x0f0),
        ((v1 >> 4) & 0xf) | (v1 & 0xf0),
        ((v1 & 0xf) << 4) | (v1 & 0xf),
        1
      );
    }

    // Detect HEX6 and convert to HSLA
    // Example: #ff0000 => hsla(0, 100%, 50%, 1)
    const reHex6Result = reHex6.exec(string);
    if (reHex6Result) {
      const v1 = parseInt(reHex6Result[1] ?? "0", 16);
      return rgbn(v1);
    }

    // Detect RGB with numbers and convert to HSLA
    // Example: rgb(255, 0, 0) => hsla(0, 100%, 50%, 1)
    const reRgbIntegerResult = reRgbInteger.exec(string);
    if (reRgbIntegerResult) {
      const v1 = parseInt(reRgbIntegerResult[1] ?? "0", 10);
      const v2 = parseInt(reRgbIntegerResult[2] ?? "0", 10);
      const v3 = parseInt(reRgbIntegerResult[3] ?? "0", 10);
      return rgbaToHsla(v1, v2, v3, 1);
    }

    // Detect RGB with percentages and convert to HSLA
    // Example: rgb(100%, 0%, 0%) => hsla(0, 100%, 50%, 1)
    const reRgbPercentResult = reRgbPercent.exec(string);
    if (reRgbPercentResult) {
      const v1 = (parseFloat(reRgbPercentResult[1] ?? "0") * 255) / 100;
      const v2 = (parseFloat(reRgbPercentResult[2] ?? "0") * 255) / 100;
      const v3 = (parseFloat(reRgbPercentResult[3] ?? "0") * 255) / 100;
      return rgbaToHsla(v1, v2, v3, 1);
    }

    // Detect RGBA with numbers and convert to HSLA
    // Example: rgba(255, 0, 0, 1) => hsla(0, 100%, 50%, 1)
    const reRgbaIntegerResult = reRgbaInteger.exec(string);
    if (reRgbaIntegerResult) {
      const v1 = parseInt(reRgbaIntegerResult[1] ?? "0", 10);
      const v2 = parseInt(reRgbaIntegerResult[2] ?? "0", 10);
      const v3 = parseInt(reRgbaIntegerResult[3] ?? "0", 10);
      const v4 = parseFloat(reRgbaIntegerResult[4] ?? "0");
      return rgba(v1, v2, v3, v4);
    }

    // Detect RGBA with percentages and convert to HSLA
    // Example: rgba(100%, 0%, 0%, 1) => hsla(0, 100%, 50%, 1)
    const reRgbaPercentResult = reRgbaPercent.exec(string);
    if (reRgbaPercentResult) {
      const v1 = (parseFloat(reRgbaPercentResult[1] ?? "0") * 255) / 100;
      const v2 = (parseFloat(reRgbaPercentResult[2] ?? "0") * 255) / 100;
      const v3 = (parseFloat(reRgbaPercentResult[3] ?? "0") * 255) / 100;
      const v4 = parseFloat(reRgbaPercentResult[4] ?? "0");
      return rgba(v1, v2, v3, v4);
    }

    // Detect named color and convert to HSLA
    // Example: red => hsla(0, 100%, 50%, 1)
    if (colors[string]) return rgbn(colors[string]!);

    // Detect transparent and convert to HSLA
    // Example: transparent => hsla(NaN, NaN, NaN, 0)
    if (string === "transparent") return rgbaToHsla(0, 0, 0, 0);

    return DEFAULT_HSLA_COLOR;
  } catch {
    return DEFAULT_HSLA_COLOR;
  }
}

/**
 * Converts a 24-bit RGB color value to an HSLA color object.
 * @param n - The 24-bit RGB color value.
 * @returns The corresponding HSLA color object.
 */
function rgbn(n: number): HSLA {
  return rgbaToHsla((n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff, 1);
}

/**
 * Converts an RGBA color to HSLA format.
 *
 * @param r - The red component of the color (0-255).
 * @param g - The green component of the color (0-255).
 * @param b - The blue component of the color (0-255).
 * @param a - The alpha (opacity) value of the color (0-1).
 * @returns The color converted to HSLA format.
 */
function rgba(r: number, g: number, b: number, a: number): HSLA {
  return rgbaToHsla(r, g, b, a);
}

/**
 * Converts an RGBA color value to an HSLA color value.
 * @param R - The red component of the RGBA color value (0-255).
 * @param G - The green component of the RGBA color value (0-255).
 * @param B - The blue component of the RGBA color value (0-255).
 * @param A - The alpha component of the RGBA color value (0-1).
 * @returns The corresponding HSLA color value.
 */
function rgbaToHsla(R: number, G: number, B: number, A: number): HSLA {
  const r = +R / 255;
  const g = +G / 255;
  const b = +B / 255;
  const a = +A;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  let h: number = 0;
  let s: number = max - min;
  const l: number = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b ? 1 : 0) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }

  return { h: Math.round(h), s: isNaN(s) ? 0 : s, l: isNaN(l) ? 0 : l, a: a };
}

/**
 * Converts the given color values to an HSLA object.
 *
 * @param h - The hue value.
 * @param s - The saturation value.
 * @param l - The lightness value.
 * @param a - The alpha value.
 * @returns The HSLA object representing the color.
 */
function hsla(h: number, s: number, l: number, a: number): HSLA {
  return { h: +h, s: +s, l: +l, a: +a };
}

/**
 * Converts an HSLA color object to a string representation.
 * @param hsla - The HSLA color object to convert.
 * @returns The string representation of the HSLA color.
 */
export function hslaToString(hsla: HSLA): string {
  const _h = Math.round(Math.max(0, Math.min(360, hsla.h))).toFixed(0);
  const _s = (Math.max(0, Math.min(1, hsla.s)) * 100).toFixed(0);
  const _l = (Math.max(0, Math.min(1, hsla.l)) * 100).toFixed(0);
  const _a = parseFloat(hsla.a.toFixed(1));

  return `hsla(${_h}, ${_s}%, ${_l}%, ${_a})`;
}

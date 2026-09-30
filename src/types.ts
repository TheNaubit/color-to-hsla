/** A color in HSLA format: the hue is an integer from 0 to 359, the saturation, the lightness and the alpha go from 0 to 1. */
export interface HSLA {
	h: number;
	s: number;
	l: number;
	a: number;
}

/** An HSL color object: the saturation and the lightness go from 0 to 1, the alpha is optional (1 by default). */
export interface IHSLColorObject {
	h: number;
	s: number;
	l: number;
	a?: number | undefined;
}

/** An RGB color object: the channels go from 0 to 255, the alpha is optional (1 by default). */
export interface IRGBColorObject {
	r: number;
	g: number;
	b: number;
	a?: number | undefined;
}

/** The color objects accepted by colorToHSLA. */
export type IColorObject = IHSLColorObject | IRGBColorObject;

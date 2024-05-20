import { describe, it, expect } from "vitest";
import { colorToHSLA, hslaToString } from "./index";
import type { HSLA } from "./types";

/**
 * Rounds the decimal values of the HSLA object to two decimal places. This is
 * useful in tests to compare the expected and actual results since some of the results
 * may have decimal values that are not rounded, which can cause the test to fail depending
 * on the precision of the decimal values.
 *
 * @param obj - The HSLA object to round the decimal values for.
 * @returns The HSLA object with rounded decimal values.
 */
function fixedDecimalsHSLA(obj: HSLA): HSLA {
  return {
    h: parseFloat(obj.h.toFixed(2)),
    s: parseFloat(obj.s.toFixed(2)),
    l: parseFloat(obj.l.toFixed(2)),
    a: parseFloat(obj.a.toFixed(2))
  };
}

const TARGET_RESULT_GREEN: HSLA = fixedDecimalsHSLA({
  h: 120,
  s: 0.5,
  l: 0.5,
  a: 1
}); // hsla(120, 50%, 50%, 1)
const TARGET_RESULT_RED: HSLA = fixedDecimalsHSLA({ h: 0, s: 1, l: 0.5, a: 1 }); // hsla(0, 100%, 50%, 1)
const TARGET_RESULT_TRANSPARENT: HSLA = fixedDecimalsHSLA({
  h: 0,
  s: 0,
  l: 0,
  a: 0
}); // hsla(0, 0%, 0%, 0)

describe("fixedDecimalsHSLA", () => {
  it("should return HSLA with fixed decimals", () => {
    const hsla: HSLA = { h: 120.123456, s: 0.123456, l: 0.123456, a: 0.123456 };

    expect(fixedDecimalsHSLA(hsla)).toEqual({
      h: 120.12,
      s: 0.12,
      l: 0.12,
      a: 0.12
    });
  });

  it("should return HSLA with fixed decimals 0", () => {
    const hsla: HSLA = { h: 120, s: 0, l: 0, a: 0 };

    expect(fixedDecimalsHSLA(hsla)).toEqual({
      h: 120,
      s: 0,
      l: 0,
      a: 0
    });
  });

  it("should return HSLA with fixed decimals 1", () => {
    const hsla: HSLA = { h: 120.1, s: 0.1, l: 0.1, a: 0.1 };

    expect(fixedDecimalsHSLA(hsla)).toEqual({
      h: 120.1,
      s: 0.1,
      l: 0.1,
      a: 0.1
    });
  });

  it("should return HSLA with fixed decimals 2", () => {
    const hsla: HSLA = { h: 120.12, s: 0.12, l: 0.12, a: 0.12 };

    expect(fixedDecimalsHSLA(hsla)).toEqual({
      h: 120.12,
      s: 0.12,
      l: 0.12,
      a: 0.12
    });
  });

  it("should return HSLA with fixed decimals 3", () => {
    const hsla: HSLA = { h: 120.123, s: 0.123, l: 0.123, a: 0.123 };

    expect(fixedDecimalsHSLA(hsla)).toEqual({
      h: 120.12,
      s: 0.12,
      l: 0.12,
      a: 0.12
    });
  });

  it("should return HSLA with fixed decimals 4", () => {
    const hsla: HSLA = { h: 120.1234, s: 0.1234, l: 0.1234, a: 0.1234 };

    expect(fixedDecimalsHSLA(hsla)).toEqual({
      h: 120.12,
      s: 0.12,
      l: 0.12,
      a: 0.12
    });
  });
});

describe("colorToHSLA", () => {
  it("should detect HSL and return HSLA", () => {
    const hsl = "hsl(120, 50%, 50%)";

    expect(colorToHSLA(hsl)).toEqual(TARGET_RESULT_GREEN);
  });

  it("should detect HSLA and return HSLA", () => {
    const hsla = "hsla(120, 50%, 50%, 1)";

    expect(colorToHSLA(hsla)).toEqual(TARGET_RESULT_GREEN);
  });

  it("should detect HSLA and return HSLA with alpha", () => {
    const hsla = "hsla(120, 50%, 50%, 0.5)";

    expect(colorToHSLA(hsla)).toEqual({ ...TARGET_RESULT_GREEN, a: 0.5 });
  });

  it("should detect HSLA and return HSLA with alpha 0", () => {
    const hsla = "hsla(120, 50%, 50%, 0)";

    expect(colorToHSLA(hsla)).toEqual({ ...TARGET_RESULT_GREEN, a: 0 });
  });

  it("should detect HEX3 and return HSLA", () => {
    const hex3 = "#f00";

    expect(colorToHSLA(hex3)).toEqual(TARGET_RESULT_RED);
  });

  it("should detect HEX6 and return HSLA", () => {
    const hex6 = "#ff0000";

    expect(colorToHSLA(hex6)).toEqual(TARGET_RESULT_RED);
  });

  it("should detect RGB with numbers and return HSLA", () => {
    const rgb = "rgb(255, 0, 0)";

    expect(colorToHSLA(rgb)).toEqual(TARGET_RESULT_RED);
  });

  it("should detect RGB with percentages and return HSLA", () => {
    const rgb = "rgb(100%, 0%, 0%)";

    expect(colorToHSLA(rgb)).toEqual(TARGET_RESULT_RED);
  });

  it("should detect RGBA with numbers and return HSLA", () => {
    const rgba = "rgba(255, 0, 0, 1)";

    expect(colorToHSLA(rgba)).toEqual(TARGET_RESULT_RED);
  });

  it("should detect RGBA with percentages and return HSLA", () => {
    const rgba = "rgba(100%, 0%, 0%, 1)";

    expect(colorToHSLA(rgba)).toEqual(TARGET_RESULT_RED);
  });

  it("should detect RGBA with percentages and return HSLA with alpha", () => {
    const rgba = "rgba(100%, 0%, 0%, 0.5)";

    expect(colorToHSLA(rgba)).toEqual({ ...TARGET_RESULT_RED, a: 0.5 });
  });

  it("should detect RGBA with percentages and return HSLA with alpha 0", () => {
    const rgba = "rgba(100%, 0%, 0%, 0)";

    expect(colorToHSLA(rgba)).toEqual({ ...TARGET_RESULT_RED, a: 0 });
  });

  it("should detect transparent and return HSLA with alpha 0", () => {
    const transparent = "transparent";

    expect(colorToHSLA(transparent)).toEqual(TARGET_RESULT_TRANSPARENT);
  });

  it("should detect invalid color and return HSLA with alpha 0", () => {
    const invalid = "invalid";

    expect(colorToHSLA(invalid)).toEqual(TARGET_RESULT_TRANSPARENT);
  });

  it("should detect named color aliceblue and return HSLA", () => {
    const aliceblue = "aliceblue";

    expect(fixedDecimalsHSLA(colorToHSLA(aliceblue))).toEqual(
      fixedDecimalsHSLA({
        h: 208,
        s: 1,
        l: 0.97,
        a: 1
      })
    );
  });

  it("should detect named color antiquewhite and return HSLA", () => {
    const antiquewhite = "antiquewhite";

    expect(fixedDecimalsHSLA(colorToHSLA(antiquewhite))).toEqual(
      fixedDecimalsHSLA({
        h: 34,
        s: 0.78,
        l: 0.91,
        a: 1
      })
    );
  });

  it("should detect named color aqua and return HSLA", () => {
    const aqua = "aqua";

    expect(fixedDecimalsHSLA(colorToHSLA(aqua))).toEqual(
      fixedDecimalsHSLA({
        h: 180,
        s: 1,
        l: 0.5,
        a: 1
      })
    );
  });

  it("should detect named color aquamarine and return HSLA", () => {
    const aquamarine = "aquamarine";

    expect(fixedDecimalsHSLA(colorToHSLA(aquamarine))).toEqual(
      fixedDecimalsHSLA({
        h: 160,
        s: 1,
        l: 0.75,
        a: 1
      })
    );
  });

  it("should detect named color azure and return HSLA", () => {
    const azure = "azure";

    expect(fixedDecimalsHSLA(colorToHSLA(azure))).toEqual(
      fixedDecimalsHSLA({
        h: 180,
        s: 1,
        l: 0.97,
        a: 1
      })
    );
  });

  it("should detect named color beige and return HSLA", () => {
    const beige = "beige";

    expect(fixedDecimalsHSLA(colorToHSLA(beige))).toEqual(
      fixedDecimalsHSLA({
        h: 60,
        s: 0.56,
        l: 0.91,
        a: 1
      })
    );
  });

  it("should detect named color bisque and return HSLA", () => {
    const bisque = "bisque";

    expect(fixedDecimalsHSLA(colorToHSLA(bisque))).toEqual(
      fixedDecimalsHSLA({
        h: 33,
        s: 1,
        l: 0.88,
        a: 1
      })
    );
  });

  it("should detect named color black and return HSLA", () => {
    const black = "black";

    expect(fixedDecimalsHSLA(colorToHSLA(black))).toEqual(
      fixedDecimalsHSLA({
        h: 0,
        s: 0,
        l: 0,
        a: 0
      })
    );
  });

  it("should detect named color blanchedalmond and return HSLA", () => {
    const blanchedalmond = "blanchedalmond";

    expect(fixedDecimalsHSLA(colorToHSLA(blanchedalmond))).toEqual(
      fixedDecimalsHSLA({
        h: 36,
        s: 1,
        l: 0.9,
        a: 1
      })
    );
  });

  it("should detect named color blue and return HSLA", () => {
    const blue = "blue";

    expect(fixedDecimalsHSLA(colorToHSLA(blue))).toEqual(
      fixedDecimalsHSLA({
        h: 240,
        s: 1,
        l: 0.5,
        a: 1
      })
    );
  });

  it("should detect named color blueviolet and return HSLA", () => {
    const blueviolet = "blueviolet";

    expect(fixedDecimalsHSLA(colorToHSLA(blueviolet))).toEqual(
      fixedDecimalsHSLA({
        h: 271,
        s: 0.76,
        l: 0.53,
        a: 1
      })
    );
  });

  it("should detect named color brown and return HSLA", () => {
    const brown = "brown";

    expect(fixedDecimalsHSLA(colorToHSLA(brown))).toEqual(
      fixedDecimalsHSLA({
        h: 0,
        s: 0.59,
        l: 0.41,
        a: 1
      })
    );
  });

  it("should detect named color burlywood and return HSLA", () => {
    const burlywood = "burlywood";

    expect(fixedDecimalsHSLA(colorToHSLA(burlywood))).toEqual(
      fixedDecimalsHSLA({
        h: 34,
        s: 0.57,
        l: 0.7,
        a: 1
      })
    );
  });

  it("should detect named color cadetblue and return HSLA", () => {
    const cadetblue = "cadetblue";

    expect(fixedDecimalsHSLA(colorToHSLA(cadetblue))).toEqual(
      fixedDecimalsHSLA({
        h: 182,
        s: 0.25,
        l: 0.5,
        a: 1
      })
    );
  });

  it("should detect named color chartreuse and return HSLA", () => {
    const chartreuse = "chartreuse";

    expect(fixedDecimalsHSLA(colorToHSLA(chartreuse))).toEqual(
      fixedDecimalsHSLA({
        h: 90,
        s: 1,
        l: 0.5,
        a: 1
      })
    );
  });

  it("should detect named color chocolate and return HSLA", () => {
    const chocolate = "chocolate";

    expect(fixedDecimalsHSLA(colorToHSLA(chocolate))).toEqual(
      fixedDecimalsHSLA({
        h: 25,
        s: 0.75,
        l: 0.47,
        a: 1
      })
    );
  });

  it("should detect named color coral and return HSLA", () => {
    const coral = "coral";

    expect(fixedDecimalsHSLA(colorToHSLA(coral))).toEqual(
      fixedDecimalsHSLA({
        h: 16,
        s: 1,
        l: 0.66,
        a: 1
      })
    );
  });
});

describe("hslaToString", () => {
  it("should return HSLA string", () => {
    const hsla: HSLA = {
      h: 120,
      s: 0.5,
      l: 0.5,
      a: 1
    };

    expect(hslaToString(hsla)).toBe("hsla(120, 50%, 50%, 1)");
  });

  it("should return HSLA string with alpha 0", () => {
    const hsla: HSLA = {
      h: 120,
      s: 0.5,
      l: 0.5,
      a: 0
    };

    expect(hslaToString(hsla)).toBe("hsla(120, 50%, 50%, 0)");
  });

  it("should return HSLA string with alpha 0.5", () => {
    const hsla: HSLA = {
      h: 120,
      s: 0.5,
      l: 0.5,
      a: 0.5
    };

    expect(hslaToString(hsla)).toBe("hsla(120, 50%, 50%, 0.5)");
  });

  it("should return HSLA string with alpha 0.1", () => {
    const hsla: HSLA = {
      h: 120,
      s: 0.5,
      l: 0.5,
      a: 0.1
    };

    expect(hslaToString(hsla)).toBe("hsla(120, 50%, 50%, 0.1)");
  });

  it("should return HSLA string with alpha 0.1 even if alpha has more decimals", () => {
    const hsla: HSLA = {
      h: 120,
      s: 0.5,
      l: 0.5,
      a: 0.1234
    };

    expect(hslaToString(hsla)).toBe("hsla(120, 50%, 50%, 0.1)");
  });
});

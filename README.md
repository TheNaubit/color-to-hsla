<h1 align="center">
  color-to-hsla
  <br>
</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/TheNaubit/color-to-hsla/main/images/color-to-hsla.png" alt="color-to-hsla" />
</p>

<h4 align="center">A tiny, dependency-free TypeScript library to convert any CSS color to HSLA.</h4>

<p align="center">
  <a href="https://github.com/TheNaubit/color-to-hsla/actions/workflows/ci.yml">
    <img src="https://github.com/TheNaubit/color-to-hsla/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI status">
  </a>
  <a href="https://github.com/TheNaubit/color-to-hsla/actions/workflows/release.yml">
    <img src="https://github.com/TheNaubit/color-to-hsla/actions/workflows/release.yml/badge.svg?branch=main" alt="Release status">
  </a>
  <a href="https://www.npmjs.com/package/@nauverse/color-to-hsla">
    <img src="https://img.shields.io/npm/v/@nauverse/color-to-hsla.svg?style=flat" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/result?p=@nauverse/color-to-hsla">
    <img src="https://img.shields.io/bundlephobia/minzip/%40nauverse/color-to-hsla" alt="minzipped size">
  </a>
  <a href="https://github.com/TheNaubit/color-to-hsla/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@nauverse/color-to-hsla.svg?style=flat" alt="license">
  </a>
</p>

<p align="center">
  <a href="#tldr">tl;dr</a> •
  <a href="#why-color-to-hsla">Why color-to-hsla?</a> •
  <a href="#installation">Installation</a> •
  <a href="#guide">Guide</a> •
  <a href="#typescript">TypeScript</a> •
  <a href="#upgrading-from-1x">Upgrading from 1.x</a> •
  <a href="#help">Help</a> •
  <a href="#contribute">Contribute</a>
</p>

## tl;dr

```bash
npm install @nauverse/color-to-hsla
```

~~~ts
import { colorToHSLA, hslaToString } from "@nauverse/color-to-hsla";

colorToHSLA("rgb(255 0 0 / 50%)");
// { h: 0, s: 1, l: 0.5, a: 0.5 }

hslaToString({ h: 120, s: 0.5, l: 0.5, a: 0.25 });
// "hsla(120, 50%, 50%, 0.25)"
~~~

## Why color-to-hsla?

Most apps only need one thing from a color library: turning whatever color a user, a design token or a CSS file gives you into numbers you can work with. color-to-hsla does exactly that, for every CSS color syntax, and always returns a normalized result: the hue is an integer from 0 to 359, and the saturation, the lightness and the alpha go from 0 to 1.

### color-to-hsla vs other libraries

Every result below was produced by running the libraries (tinycolor2 1.6.0, color 5.0.3, culori 4.0.2, color-to-hsla 2.0.0):

| Input | tinycolor2 | color | culori | color-to-hsla |
| ----- | ---------- | ----- | ------ | ------------- |
| `rgb(255 0 0 / 50%)` | Alpha lost (`a: 1`) | Correct | Correct | `{ h: 0, s: 1, l: 0.5, a: 0.5 }` |
| `rgba(255, 0, 0, 50%)` | Alpha lost (`a: 1`) | Correct | Correct | `{ h: 0, s: 1, l: 0.5, a: 0.5 }` |
| `hsl(120deg 50% 50%)` | Invalid | Correct | Correct | `{ h: 120, s: 0.5, l: 0.5, a: 1 }` |
| `hsl(0.5turn 50% 50%)` | Invalid | Throws | Correct | `{ h: 180, s: 0.5, l: 0.5, a: 1 }` |
| `hsl(-120, 50%, 50%)` | Wrong hue (`h: 0`) | Correct | Hue not normalized (`h: -120`) | `{ h: 240, s: 0.5, l: 0.5, a: 1 }` |
| `rgb(300, 0, 0)` | Clamped | Clamped | Not clamped (`s: 1.43`) | Clamped: `{ h: 0, s: 1, l: 0.5, a: 1 }` |
| Result scale | 0-1 | 0-100 | 0-1, alpha only when set | 0-1, always with alpha |
| Invalid string | Flag to check | Throws | `undefined` | `{ h: 0, s: 0, l: 0, a: 0 }` |
| Size (minified + gzipped, only what the example needs) | 5.3 kB | 8.5 kB | 5.0 kB | 2.9 kB, zero dependencies |

Choose culori or color if you need other color spaces (Lab, OKLCH, P3...), color manipulation or conversions to other formats. Choose color-to-hsla if you need HSLA, fast, with no dependencies and no surprises.

### Features

- Every CSS syntax of hex colors (`#f00`, `#f008`, `#ff0000`, `#ff000080`), `rgb()`, `rgba()`, `hsl()` and `hsla()`
- Legacy (`rgb(255, 0, 0)`) and modern (`rgb(255 0 0 / 50%)`) syntaxes, percentages, `none`, and hue units (`deg`, `grad`, `rad`, `turn`)
- All 148 CSS named colors and `transparent`
- Objects: `{ h, s, l, a }` and `{ r, g, b, a }`
- Normalized results: wrapped hue, clamped values, no floating point noise
- Never throws on strings: invalid colors return a transparent black
- `hslaToString` to go back to CSS
- Zero dependencies, ESM and CommonJS builds, TypeScript types included

## Installation

```bash
npm install @nauverse/color-to-hsla
```

~~~ts
// ESM
import { colorToHSLA, hslaToString } from "@nauverse/color-to-hsla";
// CommonJS
const { colorToHSLA, hslaToString } = require("@nauverse/color-to-hsla");
~~~

It runs in every modern browser and in Node.js 22 and later.

## Guide

### colorToHSLA

`colorToHSLA` takes a CSS color string or a color object and returns `{ h, s, l, a }`:

- `h`: the hue, an integer from 0 to 359
- `s`: the saturation, from 0 to 1
- `l`: the lightness, from 0 to 1
- `a`: the alpha, from 0 to 1

#### Hex colors

~~~ts
colorToHSLA("#f00");
// { h: 0, s: 1, l: 0.5, a: 1 }
~~~

~~~ts
colorToHSLA("#FF0000");
// { h: 0, s: 1, l: 0.5, a: 1 }
~~~

~~~ts
colorToHSLA("#ff000080");
// { h: 0, s: 1, l: 0.5, a: 0.5019607843 }
~~~

#### rgb() and rgba()

~~~ts
colorToHSLA("rgb(255, 0, 0)");
// { h: 0, s: 1, l: 0.5, a: 1 }
~~~

~~~ts
colorToHSLA("rgb(100%, 0%, 0%)");
// { h: 0, s: 1, l: 0.5, a: 1 }
~~~

~~~ts
colorToHSLA("rgba(255, 0, 0, 0.5)");
// { h: 0, s: 1, l: 0.5, a: 0.5 }
~~~

~~~ts
colorToHSLA("rgb(255 0 0 / 50%)");
// { h: 0, s: 1, l: 0.5, a: 0.5 }
~~~

#### hsl() and hsla()

~~~ts
colorToHSLA("hsl(120, 50%, 50%)");
// { h: 120, s: 0.5, l: 0.5, a: 1 }
~~~

~~~ts
colorToHSLA("hsla(120, 50%, 50%, 0.3)");
// { h: 120, s: 0.5, l: 0.5, a: 0.3 }
~~~

~~~ts
colorToHSLA("hsl(0.5turn 50% 50% / 25%)");
// { h: 180, s: 0.5, l: 0.5, a: 0.25 }
~~~

#### Named colors and transparent

~~~ts
colorToHSLA("rebeccapurple");
// { h: 270, s: 0.5, l: 0.4, a: 1 }
~~~

~~~ts
colorToHSLA("transparent");
// { h: 0, s: 0, l: 0, a: 0 }
~~~

#### Normalization

Hues wrap around, and every other value is clamped, like CSS does:

~~~ts
colorToHSLA("hsl(-120, 150%, 50%)");
// { h: 240, s: 1, l: 0.5, a: 1 }
~~~

~~~ts
colorToHSLA("rgba(300, 0, 0, 2)");
// { h: 0, s: 1, l: 0.5, a: 1 }
~~~

#### Invalid colors

Strings never throw: an invalid color returns a transparent black.

~~~ts
colorToHSLA("not a color");
// { h: 0, s: 0, l: 0, a: 0 }
~~~

#### Objects

HSL objects use a saturation and a lightness from 0 to 1, RGB objects use channels from 0 to 255. The alpha is optional (1 by default):

~~~ts
colorToHSLA({ h: 120, s: 0.5, l: 0.5 });
// { h: 120, s: 0.5, l: 0.5, a: 1 }
~~~

~~~ts
colorToHSLA({ r: 255, g: 0, b: 0, a: 0.5 });
// { h: 0, s: 1, l: 0.5, a: 0.5 }
~~~

Objects must be complete: a missing or non-numeric value, or a mix of HSL and RGB keys, throws. Keys set to `undefined` are ignored.

~~~ts
colorToHSLA({ h: 120 });
// Throws: Missing key "s" in color type hsl
~~~

### hslaToString

`hslaToString` converts an HSLA object to a CSS string. The hue wraps around, the saturation and the lightness are rounded percentages, and the alpha keeps up to three decimals:

~~~ts
hslaToString({ h: 120, s: 0.5, l: 0.5, a: 1 });
// "hsla(120, 50%, 50%, 1)"
~~~

~~~ts
hslaToString({ h: -30, s: 0.5, l: 0.5, a: 0.125 });
// "hsla(330, 50%, 50%, 0.125)"
~~~

## TypeScript

The package includes its type definitions: `HSLA` (the result) and `IColorObject` (the accepted objects: `IHSLColorObject | IRGBColorObject`). Partial objects are type errors.

## Upgrading from 1.x

Version 2 fixes many wrong results, so some of them change:

- Node.js 22 or later is required.
- `black` returned `a: 0` (it was taken as an unknown color). It now returns `a: 1`.
- The modern CSS syntax, percentage alphas, hue units and `#rgba` / `#rrggbbaa` hex colors are supported (they returned `{ h: 0, s: 0, l: 0, a: 0 }`).
- Hues wrap around (from 0 to 359) and decimal hues are rounded instead of truncated.
- Channels, saturation, lightness and alpha are clamped (`rgb(300, 0, 0)` gave a saturation above 1).
- Values have no floating point noise (`0.49999999999999994` is `0.5`), since they are rounded to 10 decimals.
- Partial or non-numeric objects throw (the missing values were taken as 0), and `null` throws a clear error. The `IColorObject` type only accepts complete objects, and the types are exported (they were not).
- `hslaToString` wraps the hue (`-30` gave `0`) and keeps up to three alpha decimals (`0.05` gave `0.1`).

## Help

Thank you for using *color-to-hsla*!

If you need any help using this library, feel free to [create a GitHub issue](https://github.com/TheNaubit/color-to-hsla/issues/new/choose) and ask your questions. I'll try to answer as quickly as possible.

## Contribute

Contributions of any kind (pull requests, bug reports, feature requests, documentation, design) are more than welcome! Read the [contributing guide](./CONTRIBUTING.md) to get started (and [AGENTS.md](./AGENTS.md) if you use a coding agent).

## Contributors

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://nauverse.com"><img src="https://avatars.githubusercontent.com/u/22015497?v=4?s=100" width="100px;" alt="Al &#124; Naucode"/><br /><sub><b>Al &#124; Naucode</b></sub></a><br /><a href="#bug-TheNaubit" title="Bug reports">🐛</a> <a href="#code-TheNaubit" title="Code">💻</a> <a href="#doc-TheNaubit" title="Documentation">📖</a> <a href="#maintenance-TheNaubit" title="Maintenance">🚧</a> <a href="#test-TheNaubit" title="Tests">⚠️</a> <a href="#infra-TheNaubit" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

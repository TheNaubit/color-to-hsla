<h1 align="center">
  🧪 color-to-hsla
  <br>
</h1>

<p align="center">
  <img src="https://github.com/TheNaubit/color-to-hsla/blob/main/images/color-to-hsla.png?raw=true" alt="color-to-hsla" />
</p>

<h4 align="center">A tiny typesafe library to convert any color in any format to HSLA.</h4>

<p align="center">
  <a href="https://github.com/TheNaubit/color-to-hsla/actions">
    <img src="https://github.com/TheNaubit/color-to-hsla/actions/workflows/release.yml/badge.svg"
         alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/@nauverse/color-to-hsla">
    <img src="https://img.shields.io/npm/v/@nauverse/color-to-hsla.svg?style=flat" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/result?p=@nauverse/color-to-hsla">
    <img src="https://img.shields.io/bundlephobia/minzip/%40nauverse/color-to-hsla" alt="minzipped size">
  </a>
</p>

<p align="center">
  <a href="#what">What?</a> •
  <a href="#why">Why?</a> •
  <a href="#how">How?</a> •
  <a href="#typescript">TypeScript</a> •
  <a href="#guide-and-examples">Guide and examples</a> •
  <a href="#help">Help</a> •
  <a href="#contribute">Contribute</a>
</p>

## tl;dr
If you just want to try and you don't want to read this guide right now (although you should in the future if you decide to use the library), you can start quickly by:

### 1. Installing the dependency:
```bash
npm install --save @nauverse/color-to-hsla
```

### 2. Checking this example of use:
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("#ff0000"); // { h: 0, s: 1, l: 0.5, a: 1 }
~~~

If you want to see more examples, jump to [here](#guide-and-examples).

### 3. You are done! 🪄
Feel free to test and explore and if later on you need more guidance, read the whole guide and ask in the GitHub repo.

## What?

*color-to-hsla* is heavily inspired in the awesome [color-to-hsla](https://github.com/css-utils/color-to-hsla) and parts of the code where adapted from it. It is a tiny JavaScript library that makes converting from any color format to the HSLA format really easy.

It works with hsl, rgb with numbers and percentages, rgba with numbers and percentages, hex3 colors, hex6 colors and even default CSS colors like `aliceblue`. This tool can be really useful to standarize colors to a single format.

### Features

  <table>
  <thead>
    <tr>
      <th><strong>v1</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0️⃣ ‎ Zero dependencies</td>
    </tr>
    <tr>
      <td>👌 <3kB <a href="https://bundlephobia.com/package/@nauverse/color-to-hsla@latest">minified and gzipped</a></td>
    </tr>
    <tr>
      <td>🔒 Reliable. Even when you pass really messed up colors (mixed case) or even invalid ones, the library does not crash, it always return something</td>
    </tr>
    <tr>
      <td>✍️ Support for hsl, hsla, rgb (with numbers and percentages), rgba (with numbers and percentages), hex3, hex6 and even CSS default colors</td>
    </tr>
    <tr>
      <td>🛟 Full of tests</td>
    </tr>
    <tr>
      <td>✅ Production ready</td>
    </tr>
  </tbody>
  </table>

## Why?

Sometimes you need to handle colors and you need to suport several formats but you do not want to be detecting/guessing all the time how to work with those colors.

An usual good way to handle that is to convert every color to a single format. This tool helps you with that, so you do not have to handle that tricky logic every time you need that functionality.

## How?

### Install

Currently, the package is distributed via NPM.

```bash
npm install --save @nauverse/color-to-hsla
```

### Usage with Node

Node 18 and above are officially supported, though you may have luck using it with an earlier Node version.

The package comes with CJS and ESM modules.

## TypeScript

This library provides its own type definitions. "It just works", no need to install anything from `@types`.

## Guide and examples
> A good contribution for this repo would be a more detailed guide about how to use it.

The most important function that this package offers is `colorToHsla`. Let's see some examples:
### HEX3 color to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("#f00"); // { h: 0, s: 1, l: 0.5, a: 1 }
~~~

### HEX6 color to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("#ff0000"); // { h: 0, s: 1, l: 0.5, a: 1 }
~~~

### RGB color with numbers to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("rgb(255, 0, 0)"); // { h: 0, s: 1, l: 0.5, a: 1 }
~~~

### RGB color with percentages to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("rgb(100%, 0%, 0%)"); // { h: 0, s: 1, l: 0.5, a: 1 }
~~~

### RGBA color with numbers to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("rgba(255, 0, 0, 1)"); // { h: 0, s: 1, l: 0.5, a: 1 }
~~~

### RGBA color with percentages to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("rgba(100%, 0%, 0%, 1)"); // { h: 0, s: 1, l: 0.5, a: 1 }
~~~

### HSL color to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("hsl(120, 50%, 50%)"); // { h: 120, s: 0.5, l: 0.5, a: 1 }
~~~

### HSLA color to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("hsla(120, 50%, 50%, 1)"); // { h: 120, s: 0.5, l: 0.5, a: 1 }
~~~

### Transparent color to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("transparent"); // { h: 0, s: 0, l: 0, a: 0 }
~~~

### Invalid color to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("hihhoihoho"); // { h: 0, s: 0, l: 0, a: 0 }
~~~

### CSS default color to HSLA object
~~~ts
import { colorToHSLA } from "@nauverse/color-to-hsla";

const myHSLAColor = colorToHSLA("azure"); // { h: 180, s: 1, l: 0.97, a: 1 }
~~~

## Help

Thank you for using *color-to-hsla*!

If you need any help using this library, feel free to [create a GitHub issue](https://github.com/TheNaubit/color-to-hsla/issues/new/choose), and ask your questions. I'll try to answer as quickly as possible.

## Contribute

Contributions of any kind (pull requests, bug reports, feature requests, documentation, design) are more than welcome! If you like this project and want to help, but feel like you are stuck, feel free to contact the maintainers.

### Building from source

Building the project should be quick and easy. If it isn't, it's the maintainer's fault. Please report any problems with building in a GitHub issue.

You need to have a reasonably recent version of node.js to build *color-to-hsla*. 
Tested on node version 18.0.0 and npm version 8.6.0.

First, clone the git repository:

```
git clone git@github.com:TheNaubit/color-to-hsla.git
```

Then switch to the newly created color-to-hsla directory and install the dependencies:

```
cd color-to-hsla
npm install
```

You can then run the unit tests to verify that everything works correctly:

```
npm run test:run
```

And finally, build the library:

```
npm run build
```

The output will appear in the `dist` directory.

Happy hacking!

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
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
# [2.0.0](https://github.com/TheNaubit/color-to-hsla/compare/v1.13.1...v2.0.0) (2026-09-30)


* docs!: release the CSS Color 4 rewrite as a major version ([bddd931](https://github.com/TheNaubit/color-to-hsla/commit/bddd93115e38273de88beef0773530185ca7f544))


### Bug Fixes

* export the public types and require complete color objects ([9470a62](https://github.com/TheNaubit/color-to-hsla/commit/9470a628e53f69fbea17c0341003af2a6cf25e6a))
* parse every CSS color syntax and normalize the results ([b53254c](https://github.com/TheNaubit/color-to-hsla/commit/b53254c88545abfc1d08c7d861ea5eee18aed7cd)), closes [#rgba](https://github.com/TheNaubit/color-to-hsla/issues/rgba) [#rrggbbaa](https://github.com/TheNaubit/color-to-hsla/issues/rrggbbaa)
* parse in linear time and follow CSS Color 4 more closely ([f8e4485](https://github.com/TheNaubit/color-to-hsla/commit/f8e4485b72776483de4bd584993f9ea74eb29c6b))
* tokenize the modern syntax and lowercase ASCII only ([841414a](https://github.com/TheNaubit/color-to-hsla/commit/841414af60a4721d88ce25753c98d5740b668c6f))


### BREAKING CHANGES

* Node.js 22 or later is required, and several results
change because wrong results are fixed: black returns a: 1, hues wrap
between 0 and 359 and are rounded, channels, saturation, lightness and
alpha are clamped, values are rounded to 10 decimals, partial,
non-numeric and mixed objects throw (and are type errors),
hslaToString wraps the hue and keeps up to three alpha decimals, and
only CSS whitespace is accepted. See "Upgrading from 1.x" in the
README.

## [1.13.1](https://github.com/TheNaubit/color-to-hsla/compare/v1.13.0...v1.13.1) (2024-05-20)


### Bug Fixes

* updated examples in the readme ([49d0633](https://github.com/TheNaubit/color-to-hsla/commit/49d0633c3b4e5cbe3f26a821da496ab45d553ea2))



# [1.13.0](https://github.com/TheNaubit/color-to-hsla/compare/v1.12.1...v1.13.0) (2024-05-20)


### Features

* added hslaToString function ([6067c1d](https://github.com/TheNaubit/color-to-hsla/commit/6067c1d093474dd6410100a36b07a7a7de8017a6))



## [1.12.1](https://github.com/TheNaubit/color-to-hsla/compare/v1.12.0...v1.12.1) (2024-05-20)


### Bug Fixes

* fixed typos ([ccc5f74](https://github.com/TheNaubit/color-to-hsla/commit/ccc5f741a785ea19aca419e6abde72c43b6994f4))



# [1.12.0](https://github.com/TheNaubit/color-to-hsla/compare/v1.11.0...v1.12.0) (2024-05-20)


### Features

* updated readme and dev dependencies ([fc7de42](https://github.com/TheNaubit/color-to-hsla/commit/fc7de420cd1cd49eb25b302f5ae1551b7b2c5b14))



# [1.11.0](https://github.com/TheNaubit/color-to-hsla/compare/4392f4cd034d771ac17ce5b9305ce81357f519b3...v1.11.0) (2024-05-20)


### Features

* first commit ([4392f4c](https://github.com/TheNaubit/color-to-hsla/commit/4392f4cd034d771ac17ce5b9305ce81357f519b3))

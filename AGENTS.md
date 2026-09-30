# color-to-hsla - agent guide

This is a publishable, dependency-free color library: `@nauverse/color-to-hsla`.
`colorToHSLA(color)` converts any CSS color string (or an HSL/RGB object) to `{ h, s, l, a }`, and `hslaToString(hsla)` converts it back to CSS.

## Commands

Use **npm** only. Node.js `^22.14.0 || >=24.10.0` (`.nvmrc` has the recommended version).

```bash
npm install
npm run lint           # Biome
npm run typecheck      # tsc --noEmit
npm run test:coverage  # Vitest with coverage thresholds
npm run build          # vite build (ESM + UMD) and tsc declarations -> dist/
```

Run lint, typecheck, tests and build before you say a task is done. CI runs the same steps on Node.js 22, 24 and 26.

## Layout

```
src/
  index.ts              public exports (colorToHSLA, hslaToString and the types)
  colorToHSLA.ts        public API: string and object parsing, hslaToString
  types.ts              public types (HSLA, IColorObject)
  lib/css.ts            CSS Color 4 parsing: hex, rgb()/rgba()/hsl()/hsla() (legacy and modern syntax), numbers, percentages, angles
  lib/convert.ts        normalization (hue wrap, clamping, rounding) and RGB to HSL conversion
  lib/named.ts          the 148 CSS named colors (checked against the color-name package)
  *.test.ts             colorToHSLA.test.ts (original suite), css-color.test.ts (CSS syntax), readme.test.ts (runs every README example)
```

## Hard rules

1. **Results are always normalized**: `h` is an integer from 0 to 359, `s`, `l` and `a` are clamped between 0 and 1 and rounded to 10 decimals (no floating point noise).
2. **Strings never throw.** An invalid color string returns `{ h: 0, s: 0, l: 0, a: 0 }`. Invalid objects (partial, non-numeric, mixed hsl and rgb keys) and non-string, non-object arguments throw. Keys set to `undefined` are ignored.
3. **Follow CSS Color 4.** The legacy syntax uses commas, no `none`, and does not mix numbers and percentages in rgb(); the modern syntax uses spaces, an optional `/ alpha`, and allows `none`, mixed channels and numbers for the hsl() percentages. Mixed syntaxes are invalid. Only CSS whitespace (space, tab, line feed, carriage return, form feed) is accepted.
8. **Parsing stays linear.** Input can be untrusted and long: no regular expression with ambiguous repetition (like `\d+\.?\d*`), and whitespace is trimmed with a loop (`trimCSS`), not a `\s+$` regular expression. `src/hardening.test.ts` checks it.
4. **The README examples are tests.** A `colorToHSLA(...)` or `hslaToString(...)` call followed by a `// <result>` comment in a `~~~ts` block is run by `src/readme.test.ts`. Keep them true.
5. **Immutability.** Do not mutate inputs or shared state.
6. **No emojis** in code, comments or docs. No `console.log`.
7. **Files stay small** (under 400 lines typical, 800 max).

## Testing

- TDD. Write the failing test first. Every bug fix gets a regression test.
- Keep coverage at 90% or more.
- To check conversions against a spec-conformant reference, compare with `culori` in a scratch directory (it does not clamp or normalize, so apply the rules above first).
- After a build change, check the packed tarball in a fresh project: `require()`, ESM `import`, and TypeScript with `moduleResolution` `bundler` and `nodenext`. Relative imports use `.js` extensions for `nodenext`.

## Releases

- Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`, `ci:`.
- Do not add "Co-Authored-By" or similar lines to commit messages.
- `semantic-release` runs in `.github/workflows/release.yml` on pushes to `main`. It sets the version, updates `CHANGELOG.md`, tags, creates the GitHub release and publishes. Do not bump `version` by hand.
- Publishing uses npm trusted publishing (OIDC) for `TheNaubit/color-to-hsla`, `release.yml` and the `npm` environment. There is no `NPM_TOKEN` or personal access token. Do not add one. If you rename the workflow file or the environment, update the trusted publisher on npm.
- Every action in `.github/workflows` is pinned to a commit SHA with the version in a comment. Check workflows with `actionlint` and `zizmor`.

## Gotchas

- `conventional-commits-filter` is a pinned dev dependency on purpose: `@conventional-changelog/git-client` (from commitlint) has an optional peer dependency on version 6, and without it npm 11 may hoist version 5 (from semantic-release) and write a lock file that `npm ci` on npm 10 (Node.js 22) rejects. After changing dependencies, check that `npm ls --all` reports no invalid package.
- `@semantic-release/changelog` 7 and `@semantic-release/git` 11 need Node.js 24.15 or later. They are pinned to 6.0.3 and 10.0.1 (same features) so that contributors on older Node.js 24 releases can install.
- Tags up to `v1.13.1` were created by the previous release tool (annotated tags). semantic-release reads them fine for versioning.

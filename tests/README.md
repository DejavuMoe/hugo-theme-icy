# Tests

Checks for the theme, run against the built demo site. CI (`.github/workflows/ci.yml`) runs all of them; this directory holds only test tooling, and the theme itself has no npm dependencies.

Build and seal the demo site into `exampleSite/public` first, from the repository root:

```sh
hugo --minify --panicOnWarning -s exampleSite --cleanDestinationDir
node tools/protect/seal.mjs exampleSite/public
node tools/protect/verify.mjs exampleSite/public
node tools/ci/budget.mjs exampleSite/public   # size budgets
node tools/ci/i18n.mjs                        # translation keys
```

Then, in `tests/`:

```sh
npm ci
npx playwright install --with-deps   # once: Chromium, Firefox and WebKit
npm run lint                         # Biome: JavaScript and CSS
npm run html                         # HTML validation of every page
npm run e2e                          # browsers: see below
npm run lighthouse                   # Lighthouse scores (needs Chrome)
```

`npm run e2e` runs, in Chromium, Firefox and WebKit:

- `pages`: key pages at 390 px and 1280 px, light and dark: no errors, no sideways scrolling, a screenshot of each in the report (`npx playwright show-report report`);
- `no-js`: the same pages with JavaScript off;
- `features`: color scheme toggle, search, image viewer, diagrams loading near the viewport, unlocking a protected post;
- `a11y`: axe-core (WCAG 2.2 AA), light and dark, in Chromium.

`SCREENSHOTS=0` skips the screenshots. Requests to other hosts (analytics, comments) get an empty response, so the checks run offline.

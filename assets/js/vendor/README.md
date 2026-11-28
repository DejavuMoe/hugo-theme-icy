# Vendored libraries

Published byte-for-byte (fingerprinted, never re-bundled) and loaded only when
a page needs them — see `vendor` in `layouts/_partials/assets/registry.html`
and `assets/js/modules/vendor.js`.

## Pele 1.6.0

- Upstream: https://github.com/obsidianmd/pele — documentation: https://pele.run/
- File: `pele.global.js` = `package/dist/pele.global.js` from the npm release, unmodified
- SHA-256: `b82d1bcd435302779a945e1e0f4a54ea56fb26e010ce3f2122f4216fcfc095d7`
- License: `pele.LICENSE` (MIT, with Lucide ISC), copied unchanged
- Used by: ` ```pele ` code blocks (`layouts/_markup/render-codeblock.html` →
  `assets/js/modules/pele.js`); styling only through Pele's documented
  `--pele-*` CSS variables (`assets/css/components/pele.css`).

## mp-darkmode 1.2.2

- Upstream: https://github.com/wechatjs/mp-darkmode — WeChat's dark mode conversion for Official Account articles
- File: `darkmode.min.js` = `package/dist/darkmode.min.js` from the npm release, unmodified
- SHA-256: `3c562121f33ff7f56f5a6c1dcce1de7b63af01582ddc96377458d8f0652d2ce4`
- License: `darkmode.LICENSE` (MIT), copied unchanged
- Used by: the dark preview of the WeChat export (`assets/js/modules/wechat.js`), in
  `hugo server` only; a published site never links it.

To update: take an exact npm release, verify its package integrity, replace both
files, update the hash above, and check a page with diagrams in light and dark (Pele) or the
dark preview of the WeChat export (mp-darkmode).

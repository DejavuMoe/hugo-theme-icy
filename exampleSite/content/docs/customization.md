+++
title = 'Customization'
description = 'Make Icy your own: colors, fonts, icons, templates and interface text.'
weight = 90
date = 2026-11-24
images = ['covers/customization.webp']
+++

Make every change in your own site, never in the theme folder. A file in your site at the same path as a theme file replaces it, and the theme stays easy to update.

## Accent color {#accent}

One color drives links, the current page and emphasis. Icy derives the rest of the palette from it: a lighter accent for the dark scheme, and greys tinted with its hue.

| Parameter | Default | Description |
| --- | --- | --- |
| `style.accent` | `'#b75133'` | A hex color or a CSS color function such as `oklch(55% 0.12 250)`. Anything else is ignored with a warning. |
| `style.accentDark` | derived | Choose the dark-scheme accent yourself. |

{{< code-toggle file="hugo" >}}
[params.style]
  accent = '#2f6f9f'
{{< /code-toggle >}}

Pick a color dark enough for link text on white. The default has a contrast ratio of 5.0.

## Light and dark {#color-scheme}

The site follows the reader's system. The toggle in the header lets readers pick the other scheme, and Icy remembers their choice. Without JavaScript, the toggle is hidden.

| Parameter | Default | Description |
| --- | --- | --- |
| `colorScheme.toggle` | `true` | Show the toggle. `false` leaves the scheme to the system. |

{{< code-toggle file="hugo" >}}
[params.colorScheme]
  toggle = false
{{< /code-toggle >}}

## Fonts {#fonts}

By default Icy loads no fonts. It uses system fonts chosen by the page language:

| Page language | Default `sans` list |
| --- | --- |
| Any | `system-ui, sans-serif` |
| Chinese | `system-ui, "PingFang SC", "Microsoft YaHei UI", "Noto Sans CJK SC", "Noto Sans SC", sans-serif` |
| Traditional Chinese | `system-ui, "PingFang TC", "Microsoft JhengHei UI", "Noto Sans CJK TC", "Noto Sans TC", sans-serif` |
| Japanese | `system-ui, "Hiragino Sans", "Yu Gothic UI", "Noto Sans CJK JP", "Noto Sans JP", sans-serif` |
| Korean | `system-ui, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans CJK KR", "Noto Sans KR", sans-serif` |

Code uses `ui-monospace, "Cascadia Mono", Menlo, Consolas, "Noto Sans Mono", "DejaVu Sans Mono", monospace`.

To use other fonts, set `[params.fonts]`:

| Parameter | Default | Description |
| --- | --- | --- |
| `fonts.sans` | system fonts | CSS `font-family` list for all text except code. Replaces the default for every language. |
| `fonts.mono` | system monospace | CSS `font-family` list for code and keyboard keys. |
| `fonts.stylesheets` | none | Font CSS loaded on every page. |

Each entry in `stylesheets` is one of:

- an absolute URL, such as a Google Fonts link: Icy also adds a `preconnect` to its host;
- a path starting with `/`: a file in your site's `static/`;
- a path in your site's `assets/`: fingerprinted in production.

A font list may contain letters, digits, spaces, quotes, commas, dots, hyphens and underscores. Icy ignores any other list with a warning. End each list with a generic family, and on Chinese, Japanese or Korean pages name the CJK faces yourself, since your list replaces the default.

### Google Fonts {#google-fonts}

Copy the stylesheet URL that [Google Fonts](https://fonts.google.com/) gives you and name the family:

{{< code-toggle file="hugo" >}}
[params.fonts]
  sans = '"Inter", system-ui, sans-serif'
  mono = '"JetBrains Mono", ui-monospace, monospace'
  stylesheets = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;600&display=swap',
  ]
{{< /code-toggle >}}

### Self-hosted fonts {#self-hosted-fonts}

A Chinese, Japanese or Korean font weighs megabytes. Split it with [WebFont Slice](https://webfont.zsh.moe/), which runs in your browser: it writes many small WOFF2 files and a `fonts.css`, so readers download only the characters a page uses.

Put the output in your site's `static/` and load the CSS with a path starting with `/`. Use the `font-family` name from `fonts.css`:

{{< code-toggle file="hugo" >}}
[params.fonts]
  sans = '"LXGW WenKai", system-ui, "PingFang SC", "Microsoft YaHei UI", "Noto Sans CJK SC", sans-serif'
  stylesheets = ['/fonts/fonts.css']    # static/fonts/fonts.css
{{< /code-toggle >}}

If you keep a hand-written `@font-face` stylesheet in `assets/` instead, refer to its font files with root-relative URLs such as `/fonts/inter.woff2`. The stylesheet itself is renamed in production.

### Fonts per language {#fonts-per-language}

Set the same keys under a language. Keys you leave out come from `[params.fonts]`:

{{< code-toggle file="hugo" >}}
[params.fonts]
  stylesheets = ['https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap']

[languages.en.params.fonts]
  sans = '"Inter", system-ui, sans-serif'

[languages.zh-cn.params.fonts]
  sans = '"Inter", system-ui, "PingFang SC", "Microsoft YaHei UI", "Noto Sans CJK SC", sans-serif'
{{< /code-toggle >}}

A much wider font needs more room in the header. After changing fonts, check the header at a few window widths.

## Site icon and wordmark {#brand}

| Parameter | Default | Description |
| --- | --- | --- |
| `brand.icon` | theme's icon | A square PNG, JPEG or WebP in `assets/`, at least 512px. |
| `brand.iconSVG` | none | An SVG favicon, in `assets/` or `static/`. |
| `brand.wordmark` | none | An SVG in `assets/` shown instead of the site title in the header. |
| `brand.themeColor.light` | `'#ffffff'` | Color of the browser's interface, such as the address bar on phones, in the light scheme. |
| `brand.themeColor.dark` | `'#241f1e'` | The same in the dark scheme. |

{{< code-toggle file="hugo" >}}
[params.brand]
  icon = 'brand/icon.png'             # assets/brand/icon.png
  wordmark = 'brand/wordmark.svg'     # assets/brand/wordmark.svg
  [params.brand.themeColor]
    light = '#ffffff'
    dark = '#241f1e'
{{< /code-toggle >}}

From `icon`, Icy generates the favicon, the Apple touch icon and the web app icons. The 512px version is also the RSS image and the publisher logo in structured data.

The wordmark is inlined and drawn 1.75rem high, in the text color. It needs:

- a `viewBox` on the root `<svg>`, or Icy warns and shows the title;
- filled `<path>` shapes, with text converted to paths;
- no colors you want to keep: `fill`, `stroke` and `style` attributes are removed.

On hover, a wave of the accent color runs through the paths in document order, so order them the way the logo is read. Screen readers still announce the site title.

## Icons {#icons}

Icons are SVG files in `assets/icons/`, used by name. To add an icon or replace one of the theme's, put a file in your site's `assets/icons/`:

```text
my-blog/
└── assets/
    └── icons/
        ├── mastodon.svg     new: name = 'mastodon'
        └── github.svg       replaces the theme's github icon
```

You choose icons for [social links](/docs/configuration/#social) and the [footer credit](/docs/configuration/#footer). The interface icons, such as `search`, `toc` and `copy`, come from [Tabler Icons](https://tabler.io/icons). Replace them only for a different style.

An icon file must:

- start with `<svg`, with no XML declaration or comment before it;
- use `currentColor` for fills and strokes, so it follows the text color;
- have a lower-case name made of letters, digits, `-` and `_`.

Icons are 1em high. A wide logo keeps the proportions of its `viewBox`.

## Extension partials {#extend}

Add your own code to every page through two partials that are empty in the theme:

| Create in your site | Rendered |
| --- | --- |
| `layouts/_partials/extend/head.html` | At the end of `<head>`, after the theme's CSS and scripts. |
| `layouts/_partials/extend/footer.html` | Just before `</body>`. |

Both receive the current page, so `.Params`, `.IsHome` and `hugo.IsProduction` work. Theme updates never touch them.

### Your own CSS {#custom-css}

Write your rules in `assets/css/custom.css` and link them from `extend/head.html`:

```go-html-template
{{- /* layouts/_partials/extend/head.html */ -}}
{{- with resources.Get "css/custom.css" }}
  {{- with . | minify | fingerprint }}
<link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
  {{- end }}
{{- end }}
```

Your rules win over the theme's. For broad changes, set the custom properties listed in the theme's `assets/css/base/tokens.css`:

```css
/* assets/css/custom.css */
:root {
  --measure: 40rem;        /* a narrower reading column */
  --radius-l: 0.25rem;     /* squarer cards */
}

/* Colors of your own: give both schemes with light-dark(). */
.my-note {
  background: light-dark(#fff8e6, #2b2618);
}
```

### Your own JavaScript {#custom-js}

Bundle a module with Hugo's `js.Build` and load it from `extend/footer.html`:

```go-html-template
{{- /* layouts/_partials/extend/footer.html */ -}}
{{- with resources.Get "js/site.js" }}
  {{- with . | js.Build (dict "minify" hugo.IsProduction) | fingerprint }}
<script type="module" src="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}"></script>
  {{- end }}
{{- end }}
```

Content added after the page loads, such as an unlocked protected post, fires an `icy:content` event on `document`. The new element is `event.detail.root`:

```js
// assets/js/site.js
function enhance(root) {
  for (const table of root.querySelectorAll("table")) table.dataset.enhanced = "yes";
}

enhance(document);
document.addEventListener("icy:content", (event) => enhance(event.detail.root));
```

## Overriding templates {#overrides}

To change a template, copy it from the theme to the same path in your site and edit the copy:

```sh
mkdir -p layouts/_partials
cp themes/hugo-theme-icy/layouts/_partials/footer.html layouts/_partials/footer.html
```

This works for page layouts, partials, shortcodes and render hooks. The same goes for a stylesheet in `assets/css/`, which replaces the theme's file as a whole. A copy no longer gets the theme's fixes, so keep overrides few and compare them with the theme's version when you update.

### Other comment or analytics services {#other-services}

Icy has Ecoku comments and Plausible analytics built in. For another comment system, override `layouts/_partials/comments.html`:

```go-html-template
{{- /* layouts/_partials/comments.html */ -}}
{{- if ne .Params.comments false }}
{{- partial "assets/use.html" (dict "page" . "feature" "comments") }}
<section class="comments" id="comments" aria-labelledby="comments-title">
  <h2 class="comments-title" id="comments-title">{{ T "comments" }}</h2>
  <div data-comments-loader="https://comments.example.com/embed.js"></div>
</section>
{{- end }}
```

The `assets/use.html` line loads the theme's comment styles and a script that loads the `data-comments-loader` URL when the reader scrolls near. If your system needs its own `<script>` tag, put that in the section instead.

For another analytics service, add its script to `extend/head.html`, in production only and respecting `analytics = false`:

```go-html-template
{{- /* layouts/_partials/extend/head.html */ -}}
{{- if and hugo.IsProduction (ne .Params.analytics false) }}
<script defer src="https://analytics.example.com/script.js" data-website-id="your-site-id"></script>
{{- end }}
```

## Interface strings and dates {#strings}

All interface text comes from the theme's `i18n/` files. To change some of it, create a file of the same name in your site's `i18n/` with only the keys you change:

```toml
# i18n/en.toml in your site
recentPosts = "Latest writing"
dateLong = "January 2, 2006"
```

The theme's `i18n/en.toml` lists every key. For a new language, copy it to your site's `i18n/`, name it after the language key, such as `ja.toml`, and translate the values. Missing strings fall back to the default language.

Dates use three keys:

| Key | English | Simplified Chinese | Used for |
| --- | --- | --- | --- |
| `dateLong` | `:date_long` | `2006年1月2日` | Article metadata, the "Updated" note and the copyright card. |
| `dateShort` | `Jan 2` | `01-02` | The home page, year-grouped archives and the changelog. |
| `dateFull` | `2006-01-02` | `2006-01-02` | Archives that are not grouped by year. |

A value is a Go time layout, written with the reference date `2006-01-02`, or a Hugo localized token such as `:date_long`.

+++
title = 'Writing'
description = 'Markdown extras and shortcodes for text, code and diagrams.'
weight = 30
date = 2026-11-24
images = ['covers/writing.webp']
+++

Icy adds a few extras to plain Markdown and a small set of shortcodes. Each one is shown live below, followed by its source. Images, audio and video are on [Media](/docs/media/).

Shortcode parameters are named, unless a table says a value can also be positional. An unknown parameter or an invalid value fails the build: see [Errors](/docs/configuration/#errors).

## Table of contents {#toc}

Articles show a table of contents beside the text on wide screens, highlighting the section you are reading. On narrow screens it opens from a floating button.

| Parameter | Default | Description |
| --- | --- | --- |
| `params.article.toc` | `true` | Site-wide switch. |
| `params.article.tocMinHeadings` | `2` | Fewer headings than this: no table of contents. |
| `params.article.tocMaxLevel` | `3` | Deepest heading level listed. |
| `toc` in front matter | — | `false` hides it on one page, `true` shows it when the site default is off. |

Hugo's `markup.tableOfContents` settings have no effect. Protected posts never show a table of contents.

Every heading gets an id and a `#` link on hover. Set your own id or class with a heading attribute:

```markdown
## Install the theme {#install .special}
```

## Links {#links}

Write internal links as site paths. Icy points each one to the page in the current language, so the same Markdown works in every translation.

```markdown
See [Media](/docs/media/#figure) and the [Showcase](/posts/).
```

Relative links to pages and page resources work too, such as `[next](../other-post/)` or `[slides](deck.pdf)`. A path that matches no page, like a file in `static/`, stays as written. External links open in the same tab, without an icon.

## Alerts {#alerts}

GitHub-style alerts become tinted cards. Text after the type replaces the default title.

> [!NOTE]
> Useful information that readers should know, even when skimming.

> [!WARNING] Back up first
> Save a copy of your configuration before you change it.

```markdown
> [!NOTE]
> Useful information that readers should know, even when skimming.

> [!WARNING] Back up first
> Save a copy of your configuration before you change it.
```

The types are `NOTE`, `TIP`, `IMPORTANT`, `WARNING` and `CAUTION`, each with its own color. To change the default titles, see [Interface strings](/docs/customization/#strings).

With `markup.goldmark.extensions.cjk.eastAsianLineBreaks` on, put an empty `>` line after a custom title. Otherwise Hugo joins the title and the next line.

## Quotes {#quotes}

When the last paragraph of a blockquote starts with `— ` or `——`, it becomes a right-aligned attribution. An optional `{cite="…"}` line after the quote records the source URL.

> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra
{cite="https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html"}

```markdown
> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra
{cite="https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html"}
```

## Task lists {#task-lists}

List items that start with `[ ]` or `[x]` become a checklist. Readers can't tick the boxes.

- [x] Install the theme
- [x] Configure the site
- [ ] Write the first post

```markdown
- [x] Install the theme
- [x] Configure the site
- [ ] Write the first post
```

## Tables {#tables}

Wide tables scroll sideways instead of widening the page. A `{#id}` or `{.class}` line after the table adds it to the table.

| Feature | Needs JavaScript |
| :--- | ---: |
| Color schemes | No |
| Search | Yes |
{#features}

```markdown
| Feature | Needs JavaScript |
| :--- | ---: |
| Color schemes | No |
| Search | Yes |
{#features}
```

## Footnotes {#footnotes}

Hover over a footnote number, or focus it, to preview the note in place.[^preview] On touch screens a tap jumps to the note at the end of the page.

[^preview]: The note, also listed at the end of the page.

```markdown
Hover over a footnote number to preview the note in place.[^preview]

[^preview]: The note, also listed at the end of the page.
```

## Block attributes {#block-attributes}

A `{…}` line right after a block adds attributes to it. Icy styles four classes for paragraphs: `align-left`, `align-center`, `align-right` and `align-justify`.

This paragraph is centered.
{.align-center}

```markdown
This paragraph is centered.
{.align-center}
```

Block attributes need the Markdown settings from [Getting started](/docs/installation/#configure).

## Highlighting {#highlight}

Marked text gets a hand-drawn highlighter stroke.

Only <mark>this part</mark> matters.

```markdown
Only <mark>this part</mark> matters.
```

Write it in one of two ways:

- `<mark>` as raw HTML, with `markup.goldmark.renderer.unsafe = true`.
- `==text==`, with Hugo's `markup.goldmark.extensions.extras.mark` turned on.

## Code blocks {#code}

Fenced code blocks get syntax highlighting that follows the color scheme, a header with the language or file name, and a Copy button.

```go {title="main.go" linenos=true hl_lines=[6]}
package main

import "fmt"

func main() {
	fmt.Println("Hello, Icy")
}
```

````markdown
```go {title="main.go" linenos=true hl_lines=[6]}
package main

import "fmt"

func main() {
	fmt.Println("Hello, Icy")
}
```
````

Options go in braces after the language:

| Parameter | Default | Description |
| --- | --- | --- |
| `title` or `filename` | — | Shown in the header instead of the language. |
| `linenos` | `false` | `true` adds line numbers. The Copy button leaves them out. |
| `linenostart` | `1` | First line number. |
| `hl_lines` | — | Lines to highlight, such as `[2]` or `["2-4", 7]`. |

Plain text blocks show no label. Icy colors code with its own stylesheet, so `markup.highlight.style` has no effect.

## code-toggle {#code-toggle}

Write a configuration example once in TOML, and readers get a TOML tab and a YAML tab. It replaces Hugo's built-in `code-toggle`.

{{< code-toggle file="hugo" >}}
[params.style]
  accent = '#b75133'   # the one configurable color
{{< /code-toggle >}}

```markdown
{{</* code-toggle file="hugo" */>}}
[params.style]
  accent = '#b75133'   # the one configurable color
{{</* /code-toggle */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `file` | — | File name without extension: `hugo` shows as `hugo.toml` and `hugo.yaml`. |
| `fm` | `false` | `true` treats the content as front matter. `file` then names the content file, such as `content/about`. |
| `copy` | — | Ignored. Every code block has a Copy button. |

The YAML tab sorts keys and drops comments, so put explanations around the block. Invalid TOML fails the build.

## Diagrams {#diagrams}

A fenced block with the language `pele` becomes a diagram. Write it in [Mermaid](https://mermaid.js.org/) syntax; [Pele](https://pele.run/) renders it.

```pele
flowchart LR
  accTitle: Publishing a post
  accDescr: Write, build, seal, then deploy.
  write["Write"] --> build["hugo --minify"] --> seal["seal + verify"] --> deploy["Deploy"]
```

````markdown
```pele
flowchart LR
  accTitle: Publishing a post
  accDescr: Write, build, seal, then deploy.
  write["Write"] --> build["hugo --minify"] --> seal["seal + verify"] --> deploy["Deploy"]
```
````

- The renderer, about 250 KB gzipped, loads only when a diagram comes near the screen.
- Readers can zoom in and out. Colors follow the color scheme.
- Without JavaScript, or on a syntax error, the source is shown as code.
- `accTitle` and `accDescr` give the diagram an accessible name and description.
- Links and images inside diagrams are turned off. A `mermaid` block stays plain code.

More diagram types are in [Code and diagrams](/posts/code-and-diagrams/).

## Collapsible sections {#details}

A collapsible section that works without JavaScript and opens for the browser's find-in-page. Blocks with the same `name` form an accordion: opening one closes the others. It replaces Hugo's built-in `details`.

{{< details summary="Does Icy need JavaScript?" name="faq" >}}
No. Every page works without it, and scripts only **add** to it.
{{< /details >}}
{{< details summary="Can I use Markdown inside?" name="faq" >}}
Yes, in the content and inline in `summary`.
{{< /details >}}

```markdown
{{</* details summary="Does Icy need JavaScript?" name="faq" */>}}
No. Every page works without it, and scripts only **add** to it.
{{</* /details */>}}
{{</* details summary="Can I use Markdown inside?" name="faq" */>}}
Yes, in the content and inline in `summary`.
{{</* /details */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `summary` | required | The always-visible label. Inline Markdown. |
| `name` | — | Accordion group on this page. |
| `open` | `false` | Start expanded. |
| `class` | — | Extra class on the `<details>` element. |

## Tabs {#tabs}

Tabbed panels. Without JavaScript every panel is shown under its title, and find-in-page switches to the tab that matches.

{{< tabs label="Install Hugo" >}}
{{< tab title="macOS" >}}
```sh
brew install hugo
```
{{< /tab >}}
{{< tab title="Windows" >}}
```sh
winget install Hugo.Hugo.Extended
```
{{< /tab >}}
{{< /tabs >}}

````markdown
{{</* tabs label="Install Hugo" */>}}
{{</* tab title="macOS" */>}}
```sh
brew install hugo
```
{{</* /tab */>}}
{{</* tab title="Windows" */>}}
```sh
winget install Hugo.Hugo.Extended
```
{{</* /tab */>}}
{{</* /tabs */>}}
````

| Parameter | Default | Description |
| --- | --- | --- |
| `label` on `tabs` | — | Accessible name of the tab list. |
| `default` on `tabs` | `1` | The tab shown first, counted from 1. |
| `title` on `tab` | required | Tab label. Inline Markdown. |

Each `tab` sits directly inside `tabs`. Arrow keys, {{< kbd "Home" >}} and {{< kbd "End" >}} move between tabs.

## Repository cards {#repo}

A card for a GitHub, Forgejo or Gitea repository: description, language, stars, forks, license and last push, fetched at build time.

{{< repo url="https://github.com/DejavuMoe/Smoji" >}}

```markdown
{{</* repo url="https://github.com/DejavuMoe/Smoji" */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `url` | required | `https://host/owner/repo`. Can be the only positional value. |
| `title` | `owner/name` | Replaces the displayed name. |
| `description` | From the API | Replaces the description. |

### Grid {#repo-grid}

`repo-grid` lays out several cards in a responsive grid. It takes no parameters.

{{< repo-grid >}}
{{< repo url="https://github.com/DejavuMoe/edgeTTS" >}}
{{< repo url="https://github.com/DejavuMoe/Ecoku" >}}
{{< repo url="https://github.com/DejavuMoe/PicForge" >}}
{{< repo "https://github.com/DejavuMoe/sani" >}}
{{< /repo-grid >}}

```markdown
{{</* repo-grid */>}}
{{</* repo url="https://github.com/DejavuMoe/edgeTTS" */>}}
{{</* repo url="https://github.com/DejavuMoe/Ecoku" */>}}
{{</* repo url="https://github.com/DejavuMoe/PicForge" */>}}
{{</* repo "https://github.com/DejavuMoe/sani" */>}}
{{</* /repo-grid */>}}
```

### Fetching {#repo-fetch}

GitHub repositories are read from `api.github.com`. Any other host is queried as Forgejo or Gitea at `/api/v1/repos/<owner>/<repo>`.

{{< code-toggle file="hugo" >}}
[params.repo]
  userAgent = 'hugo-theme-icy'
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `params.repo.userAgent` | `hugo-theme-icy` | `User-Agent` header sent with every request. |

- Responses stay in Hugo's file cache. To refresh stars and dates, let the cache expire: see [Caches](/docs/deployment/#caches).
- GitHub allows 60 anonymous requests an hour. To raise the limit, give the build a token: see [GitHub token](/docs/deployment/#github-token).
- If a request fails, the build logs an `icy-remote-fetch` warning and the card shows only the owner, name and link: see [Network access](/docs/deployment/#network).
- A repository that doesn't exist gets the same bare card without a warning, so check the URL.

## Keyboard keys {#kbd}

Keys and shortcuts, separated by `+`.

Press {{< kbd "Ctrl+Shift+P" >}} or {{< kbd keys="⌘+K" >}}.

```markdown
Press {{</* kbd "Ctrl+Shift+P" */>}} or {{</* kbd keys="⌘+K" */>}}.
```

| Parameter | Default | Description |
| --- | --- | --- |
| `keys` | required | The keys. Can be the only positional value. Write the plus key as `Plus`. |

## Ruby annotations {#ruby}

A reading above text, such as pinyin or furigana. With one space-separated syllable per character, each character gets its own. Otherwise the reading spans the whole text.

{{< ruby "汉字" "hàn zì" >}} and {{< ruby "東京" "とうきょう" >}}

```markdown
{{</* ruby "汉字" "hàn zì" */>}} and {{</* ruby "東京" "とうきょう" */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `text` | required | The base text. First positional value. |
| `reading` | required | The annotation. Second positional value. |

Browsers without ruby support show the reading in parentheses after the text.

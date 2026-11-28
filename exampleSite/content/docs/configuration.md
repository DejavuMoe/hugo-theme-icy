+++
title = 'Configuration'
description = 'Site settings, menus, site parameters and front matter keys.'
weight = 20
date = 2026-11-24
images = ['covers/configuration.webp']
+++

Icy has a default for every parameter, so set only what you want to change. Parameters that belong to a single feature are documented with that feature: see [Elsewhere](#elsewhere).

## Hugo settings {#hugo-settings}

Standard Hugo settings, outside `[params]`, that Icy uses. The `[markup]` settings Icy needs are in [Getting started](/docs/installation/#configure).

| Setting | Description |
| --- | --- |
| `mainSections` | The sections that hold your posts, such as `['posts']`. See [Main sections](/docs/pages/#main-sections). |
| `hasCJKLanguage` | `true` if you write in Chinese, Japanese or Korean, so word counts and reading times are right. |
| `markup.goldmark.extensions.cjk` | For Chinese and Japanese: joins the lines of a paragraph without a space. |
| `pagination.pagerSize` | Posts per page when [list pagination](/docs/pages/#lists) is on. |
| `services.rss.limit` | Maximum number of items per feed. |
| `copyright` | Only the RSS `<copyright>` element. The footer's © line comes from [`params.footer`](#footer). |

A site written in Chinese adds:

{{< code-toggle file="hugo" >}}
hasCJKLanguage = true

[markup.goldmark.extensions.cjk]
  enable = true
  eastAsianLineBreaks = true
{{< /code-toggle >}}

## Menus {#menus}

Icy reads two menus: `main` in the header and `footer` at the bottom of every page. Give each entry a `name`, a `weight` and a target. Use `pageRef` for a page of your site, so the link follows the current language and marks the current page, and `url` for anything else.

{{< code-toggle file="hugo" >}}
[[menus.main]]
  name = 'Posts'
  pageRef = '/posts'
  weight = 10
[[menus.main]]
  name = 'Tags'
  pageRef = '/tags'
  weight = 20

[[menus.footer]]
  name = 'About'
  pageRef = '/about'
  weight = 10
{{< /code-toggle >}}

- **Header:** the links sit beside the site name when they fit. Otherwise a menu button opens them in a full-screen panel, together with the language and color-scheme choices. An entry for the search page is skipped, because the header already has a search icon.
- **Footer:** one centered row of small links above the © line. Up to five stay on one line on phones. Without entries, the row is left out.

On a multilingual site, define the menus per language: see [Multilingual](/docs/multilingual/#languages).

## Site parameters {#general}

All of these go under `[params]`.

| Parameter | Default | Description |
| --- | --- | --- |
| `description` | none | Site description: the home page's meta description, the RSS channel description and the fallback for pages without one. |
| `shortName` | site title | `short_name` in the web app manifest. |
| `hideMeta` | `false` | Hide the date, reading time and word count on every page. |

### Author {#author}

| Parameter | Default | Description |
| --- | --- | --- |
| `author.name` | site title | Shown in the home intro, the © line and the copyright card. The author in metadata. |
| `author.avatar` | none | Home intro avatar. An image in `assets/` is cropped square. A `static/` path or a URL is used as it is. |
| `author.bio` | none | One line under the name on the home page. Markdown. |

### Social links {#social}

Each `[[params.social]]` entry adds an icon link, with `rel="me"`, to the home intro.

| Key | Description |
| --- | --- |
| `name` | The icon: `github`, `x`, `telegram`, `rss`, or [one of your own](/docs/customization/#icons). |
| `url` | The link. |
| `title` | Accessible name, such as `GitHub`. |

{{< code-toggle file="hugo" >}}
[params.author]
  name = 'Ada'
  avatar = 'avatar.png'
  bio = 'Writes about **type** and the web.'

[[params.social]]
  name = 'github'
  title = 'GitHub'
  url = 'https://github.com/you'
[[params.social]]
  name = 'mastodon'
  title = 'Mastodon'
  url = 'https://mastodon.social/@you'
{{< /code-toggle >}}

### Articles {#article}

| Parameter | Default | Description |
| --- | --- | --- |
| `article.toc` | `true` | Table of contents: beside the article on wide screens, behind a button on narrow ones. |
| `article.tocMinHeadings` | `2` | Show it only with at least this many headings. |
| `article.tocMaxLevel` | `3` | Deepest heading level listed. It always starts at `h2`. |
| `article.readingTime` | `true` | Show the reading time. |
| `article.wordCount` | `true` | Show the word count. |
| `article.cover` | `true` | Show the cover image at the top of articles. |
| `article.imageViewer` | `true` | Open images in the full-screen viewer when clicked. |

Set `license` to end every post in the main sections with a copyright card: title, link, author, date and license. The [Showcase](/posts/) posts have one.

| Parameter | Default | Description |
| --- | --- | --- |
| `article.copyright.license` | none | License name, such as `'CC BY 4.0'`. |
| `article.copyright.url` | none | Turns the license name into a link. |
| `article.copyright.note` | none | An extra line at the bottom. Markdown. |

{{< code-toggle file="hugo" >}}
[params.article.copyright]
  license = 'CC BY-NC 4.0'
  url = 'https://creativecommons.org/licenses/by-nc/4.0/'
  note = 'When you repost or quote this post, follow the license: credit the source and make no commercial use.'
{{< /code-toggle >}}

On a multilingual site, put `note` in each language's `params.article.copyright` and the card follows the page language. Do the same with `url` when the license page has a translation. See [Languages](/docs/multilingual/#languages).

#### QR codes {#qrcodes}

Add `article.qrcodes` to put small buttons above the copyright card, such as a WeChat official account and a tip code. Hovering, clicking or tapping a button shows its square image, published as it is. The [Showcase](/posts/) posts have two.

| Parameter | Default | Description |
| --- | --- | --- |
| `icon` | `'qrcode'` | An [icon](/docs/customization/#icons). The theme also has `wechat` and `coffee`. |
| `label` | none | Button text. Leave it empty for a round icon-only button. |
| `image` | none | A square image in `assets/` or `static/`, or a URL. Required. |
| `caption` | none | A line under the image. Markdown. Required without a `label`: it names the button for screen readers. |

{{< code-toggle file="hugo" >}}
[[params.article.qrcodes]]
  icon = 'wechat'
  label = 'WeChat'
  image = 'qrcodes/wechat.png'
  caption = 'Scan to follow'
[[params.article.qrcodes]]
  icon = 'coffee'
  label = 'Tip'
  image = 'qrcodes/tip.png'
{{< /code-toggle >}}

On a multilingual site, put the list in each language's params, with labels in that language.

### Footer {#footer}

The footer is centered, one item per line: the [footer menu](#menus), `© <since>–<this year> <author.name>`, "Powered by Hugo & Icy", the credit and your own text.

| Parameter | Default | Description |
| --- | --- | --- |
| `footer.copyright` | `true` | Show the © line. |
| `footer.since` | year of the earliest page | First year of the © range. |
| `footer.poweredBy` | `true` | Show "Powered by Hugo & Icy". |
| `footer.text` | none | An extra line. Markdown. |
| `footer.credit.prefix` | none | Text before the credit link, such as `'Hosted on'`. |
| `footer.credit.name` | none | Link text, or the icon's accessible name. |
| `footer.credit.url` | none | The credit link. |
| `footer.credit.icon` | none | An [icon](/docs/customization/#icons) shown instead of the name. |
| `footer.credit.suffix` | none | Text after the credit link. |

{{< code-toggle file="hugo" >}}
[params.footer]
  since = 2019
  [params.footer.credit]
    prefix = 'Hosted on'
    name = 'Cloudflare'
    url = 'https://pages.cloudflare.com/'
    icon = 'cloudflare'
{{< /code-toggle >}}

### Speculation rules {#speculation-rules}

Supporting browsers start loading a page of your site just before the reader clicks its link.

| Parameter | Default | Description |
| --- | --- | --- |
| `speculationRules.enable` | `true` | Turn speculative loading on or off. |
| `speculationRules.action` | `'prefetch'` | `prefetch` or `prerender`. |
| `speculationRules.eagerness` | `'moderate'` | `conservative`, `moderate`, `eager` or `immediate`. |

Links with `rel="nofollow"`, a `download` attribute or a `data-no-speculate` attribute are never loaded ahead.

## Front matter {#front-matter}

Page-level keys. Where a site parameter does the same thing, the page key overrides it.

### Display {#display}

| Key | Description |
| --- | --- |
| `title` | Page title. |
| `description` | One sentence for search engines, social cards, search results and RSS. Section and tag pages also show it under the title. Defaults to the summary. |
| `date`, `lastmod` | Publication date. A `lastmod` on a later day adds "Updated …". |
| `draft` | Shows a "Draft" label. Drafts are left out of production builds. |
| `tags` | Shown as `#tag` links under the metadata. |
| `weight` | Order in sections that are not main sections, like these docs. |
| `toc` | Show or hide the table of contents. |
| `hideMeta` | Hide the date, reading time and word count. |
| `images` | Cover and social preview image. See [Covers](/docs/media/#covers). |
| `hideCover` | Keep the cover off the page. It is still the social preview. |

### Copyright card {#copyright-card}

| Key | Description |
| --- | --- |
| `original` | `false` marks a repost and hides the card. |
| `copyright` | `false` hides the card. |
| `license` | License for this post only. |
| `qrcodes` | `false` hides the [QR code buttons](#qrcodes). |

### Visibility {#visibility}

| Key | Description |
| --- | --- |
| `hiddenInHomeList` | Leave out of the home page's recent posts. |
| `searchHidden` | Leave out of the search index. |
| `hiddenInRss` | Leave out of RSS feeds. |
| `robotsNoIndex` | Add `noindex, nofollow` and leave out of the sitemap. |
| `sitemap.disable` | Hugo's own key: leave out of the sitemap only. |
| `comments` | `false` turns comments off. |
| `analytics` | `false` turns analytics off. |

### Special pages {#special-pages}

| Key | Description |
| --- | --- |
| `layout` | `search`, `friends` or `changelog`. See [Pages](/docs/pages/). |
| `placeholder` | Search page: the search field's placeholder. |
| `changes` | Changelog page: entries with `date`, `title` and an optional `summary`. |
| `initial` | Tag page: the letter the tag is filed under. See [Tags](/docs/pages/#tags). |
| `schemaType` | Structured data type outside the main sections: `WebPage` by default, or `AboutPage`, `ContactPage`, `ProfilePage`, `FAQPage`. Posts are always `BlogPosting`. |
| `protected` | Password protection. See [Protected posts](/docs/protected-posts/#protect). |

An about page, for example:

{{< code-toggle fm=true >}}
title = 'About'
schemaType = 'AboutPage'
toc = false
comments = false
{{< /code-toggle >}}

## Errors {#errors}

Icy ignores parameters it does not know. If a setting has no effect, check its spelling and its table. In TOML, every key after a `[table]` header belongs to that table, so top-level keys such as `mainSections` go before the first header.

A value Icy cannot use stops the build with a message that names it. For example:

- a shortcode parameter that does not exist, or an image the shortcode cannot find;
- a theme color that is not `#rgb` or `#rrggbb`, or a brand icon missing from `assets/`;
- an unknown comments or analytics provider, or a missing required setting;
- a protected page without a password, or an unsupported `schemaType`;
- a friend without `name` or `url`, or a changelog entry without `date` or `title`.

Smaller problems, such as an invalid accent color or a non-square icon, only log a warning. Building with `--panicOnWarning` turns every warning into an error.

## Elsewhere {#elsewhere}

These settings and parameters are documented with their feature.

| Key | See |
| --- | --- |
| `params.home` | [Home page](/docs/pages/#home) |
| `params.list` | [Lists](/docs/pages/#lists) |
| `params.search` | [Search](/docs/pages/#search) |
| `params.friends` | [Friends](/docs/pages/#friends) |
| `params.livePhoto` | [Live photos](/docs/media/#live-photo) |
| `params.repo` | [Repository cards](/docs/writing/#repo) |
| `params.comments` | [Comments](/docs/integrations/#ecoku) |
| `params.analytics` | [Analytics](/docs/integrations/#analytics) |
| `params.images`, `params.schema`, `params.verification` | [SEO](/docs/integrations/#seo) |
| `enableRobotsTXT`, `params.robots` | [robots.txt](/docs/integrations/#robots) |
| `params.rss` | [RSS](/docs/integrations/#rss) |
| `params.wechat` | [WeChat Official Account](/docs/integrations/#wechat) |
| `params.style` | [Accent color](/docs/customization/#accent) |
| `params.colorScheme` | [Light and dark](/docs/customization/#color-scheme) |
| `params.fonts` | [Fonts](/docs/customization/#fonts) |
| `params.brand` | [Site icon and wordmark](/docs/customization/#brand) |
| `languages`, `params.languageShort` | [Multilingual](/docs/multilingual/) |
| `ignoreLogs` | [Network access](/docs/deployment/#network) and [the protected posts warning](/docs/protected-posts/#warning) |
| `caches` | [Caches](/docs/deployment/#caches) |

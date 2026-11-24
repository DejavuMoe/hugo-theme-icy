+++
title = 'Integrations'
description = 'Add comments and analytics, and tune search engine metadata, robots.txt and feeds.'
weight = 70
date = 2026-11-24
images = ['covers/integrations.webp']
+++

Icy has one built-in comment system, Ecoku, and one analytics service, Plausible. Both can be self-hosted. To use another service, override a template: see [Customization](/docs/customization/#overrides).

## Comments {#comments}

Ecoku is a self-hosted comment service. Comments appear at the end of every regular page once you configure it:

{{< code-toggle file="hugo" >}}
[params.comments]
  provider = 'ecoku'
  [params.comments.ecoku]
    serverURL = 'https://comments.example.com'
    siteId = 'example.com'
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `provider` | `''` | `ecoku`, or empty for no comments. |
| `ecoku.serverURL` | — | Required. Base URL of your Ecoku server. |
| `ecoku.siteId` | — | Required. The site's id on that server. |
| `ecoku.scriptURL` | `<serverURL>/client/ecoku-loader.js` | The loader script. |
| `ecoku.cssURL` | `none` | `none` uses the theme's styles. Set a URL to use Ecoku's own stylesheet. |
| `ecoku.pageSize` | `10` | Comments per page, 1 to 100. |
| `ecoku.theme` | `auto` | `auto` follows the page's color scheme. `light` or `dark` fixes it. |
| `ecoku.i18n` | from the page's language | Interface language: `en`, `zh-CN` or `zh-Hant`. Other languages use the Ecoku site's default. |

- A page turns comments off with `comments = false` in its front matter.
- Comments are stored by page path, such as `/posts/my-post/`, so keep URLs stable.
- Nothing loads until the reader scrolls near the comments, or opens the page at `#comments`.

## Analytics {#analytics}

[Plausible Community Edition](https://github.com/plausible/analytics) is the self-hosted Plausible. The same settings work with the hosted plausible.io.

{{< code-toggle file="hugo" >}}
[params.analytics]
  provider = 'plausible'
  [params.analytics.plausible]
    scriptURL = 'https://plausible.example.com/js/pa-XXXX.js'
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `provider` | `''` | `plausible`, or empty for no analytics. |
| `plausible.scriptURL` | — | Required. The script from the snippet Plausible shows for your site. |
| `plausible.endpoint` | — | Event endpoint, for a proxied setup. |

The script is added to every page in every environment. Plausible ignores visits from `localhost`, so `hugo server` doesn't count. A page opts out with `analytics = false` in its front matter.

## Search engines and social previews {#seo}

Every page gets a title, a description, a canonical link, `hreflang` links to its translations, Open Graph and Twitter card tags, and JSON-LD. You don't need to configure anything.

The description is the front matter `description`, or else the start of the page, or else `params.description`. Posts in the main sections are Open Graph `article`s; every other page is a `website`.

### Social preview image {#social-image}

The first match wins:

1. The first entry of front matter `images`.
2. A bundle image whose name contains `cover`, `feature` or `thumbnail`.
3. The first entry of `params.images`, the site default.

Local images wider than 1200px are scaled down, and WebP, TIFF and BMP become JPEG so every crawler can read them. Protected posts never have one.

{{< code-toggle file="hugo" >}}
[params]
  images = ['og.png']
  [params.schema]
    twitterSite = '@handle'
{{< /code-toggle >}}

### Indexing {#indexing}

- Outside production, as in `hugo server`, every page is marked `noindex, nofollow`.
- `robotsNoIndex = true` in a page's front matter does the same in production and leaves the page out of the sitemap.

### Site verification {#verification}

Each token becomes a `<meta>` tag on every page.

{{< code-toggle file="hugo" >}}
[params.verification]
  google = 'token'
  bing = 'token'
  yandex = 'token'
  baidu = 'token'
  naver = 'token'
{{< /code-toggle >}}

### Structured data {#structured-data}

| Page | JSON-LD type |
| --- | --- |
| Home | `WebSite` |
| Post in a main section | `BlogPosting` |
| Other regular page | `WebPage`, or the front matter `schemaType`: `AboutPage`, `ContactPage`, `ProfilePage` or `FAQPage` |
| Section, taxonomy or term | `CollectionPage` |
| Search page | `SearchResultsPage` |

Every page except the home page also gets a breadcrumb trail. All of them name the same publisher:

{{< code-toggle file="hugo" >}}
[params.schema]
  publisherType = 'Person'
  sameAs = ['https://github.com/you', 'https://mastodon.social/@you']
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `publisherType` | `Person` | `Person` uses `params.author.name`. `Organization` uses the site title. |
| `sameAs` | `http(s)` links in `params.social` | The publisher's profile URLs. |

### Sitemap {#sitemap}

`sitemap.xml` leaves out pages with `robotsNoIndex = true` or `sitemap.disable = true`, protected posts, and tags without a public post. List pages take the date of their newest post. `changefreq` and `priority` come from Hugo's `sitemap` settings.

## robots.txt {#robots}

{{< code-toggle file="hugo" >}}
enableRobotsTXT = true

[params.robots]
  blockAI = true
{{< /code-toggle >}}

A production build allows every path; any other environment disallows everything. The file links to the sitemap.

`blockAI = true` adds a record that blocks known AI crawlers, such as `GPTBot`, `ClaudeBot` and `CCBot`. Search engines are not affected. To change the list, copy `layouts/_partials/func/ai-crawlers.html` into your site and edit it.

## RSS {#rss}

Hugo writes a feed for the home page, each section and each term. The home feed at `/index.xml` holds only posts from the main sections.

{{< code-toggle file="hugo" >}}
[params.rss]
  fullText = true

[services.rss]
  limit = 20
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `params.rss.fullText` | `false` | `true` puts the full content in each item. |
| `services.rss.limit` | Unlimited | Items per feed. A Hugo setting. |

- Protected posts and pages with `hiddenInRss = true` are left out.
- Each tag becomes a `category`. The channel image is the brand icon, or else the first `params.images` entry.
- Full-text items drop buttons and player controls, and make links absolute so they work in feed readers.

With full text, links in your posts reach the feeds: never [link to a protected post](/docs/protected-posts/#public).

+++
title = 'Integrations'
description = 'Add comments and analytics, tune search engine metadata, robots.txt and feeds, and copy posts to WeChat.'
weight = 70
date = 2026-11-24
images = ['covers/integrations.webp']
+++

Icy has one built-in comment system, Ecoku, and one analytics service, Plausible. Both can be self-hosted. To use another service, override a template: see [Customization](/docs/customization/#overrides).

## Comments {#ecoku}

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

## WeChat Official Account {#wechat}

Copy a post into the WeChat Official Account editor with the look it has on your site. This works in the local preview only: a published site gets no markup, styles or scripts for it.

{{< code-toggle file="hugo" >}}
[params.wechat]
  enable = true
  baseURL = 'https://example.com/'
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `enable` | `false` | Turn the export on under `hugo server`. |
| `baseURL` | None | The public address of your site. Links to your own pages are listed with it; without it they become plain text. |

1. Run `hugo server` and open a post.
2. Add `#wechat` to the end of its address.
3. Check the preview on a desktop, tablet and phone screen, in light and dark, then select **Copy article**.
4. Paste into the WeChat editor.
5. Upload each file in the list at the line that names it, then delete that line.

WeChat keeps only part of a web page, so the copy differs from the post:

- **Images, audio and video** are not copied. A line with the file name marks the place of each one.
- **Diagrams** become transparent PNG files to download and upload. Their tones read on WeChat's white ground and on its dark one.
- **Links** work only inside WeChat. Other links keep their text, get a number, and are listed with their addresses at the end.
- **Code** has no font of its own: WeChat asks for no font family, so each device shows code in its own monospace font.
- **Wide tables** scroll sideways on a phone instead of squeezing their columns.
- **Tabs and collapsed sections** are shown in full. A live photo keeps its still image, and a YouTube video becomes a reference to its address.
- **Dark mode** is WeChat's own: it recolors every article and an author cannot style it. The dark preview runs the same conversion, so it shows what readers get.

The copy follows WeChat's [rules for editor content](https://github.com/wechatjs/verify-article-structure-spec), and the three preview screens are the widths its own check measures.

The words written into the copy, such as "Image" and "References", follow the page's language: see [Interface strings](/docs/customization/#strings). The look of the copy comes from the rules under `.prose[data-wechat]`; change it in [your own CSS](/docs/customization/#custom-css). Protected posts cannot be exported.

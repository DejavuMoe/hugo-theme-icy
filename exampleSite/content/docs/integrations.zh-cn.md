+++
title = '集成'
description = '接入评论和统计，调整搜索引擎元数据、robots.txt 和订阅源。'
weight = 70
date = 2026-11-24
images = ['covers/integrations.webp']
+++

Icy 内置一种评论系统 Ecoku 和一种统计服务 Plausible，两者都可以自托管。要换用其他服务，覆盖相应的模板即可，见 [自定义](/docs/customization/#overrides)。

## 评论 {#comments}

Ecoku 是一个自托管的评论服务。配置好之后，评论会显示在每个普通页面的末尾：

{{< code-toggle file="hugo" >}}
[params.comments]
  provider = 'ecoku'
  [params.comments.ecoku]
    serverURL = 'https://comments.example.com'
    siteId = 'example.com'
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `provider` | `''` | `ecoku`，留空则不开启评论。 |
| `ecoku.serverURL` | — | 必填。Ecoku 服务器的根地址。 |
| `ecoku.siteId` | — | 必填。站点在该服务器上的 id。 |
| `ecoku.scriptURL` | `<serverURL>/client/ecoku-loader.js` | 加载器脚本。 |
| `ecoku.cssURL` | `none` | `none` 使用主题的样式。设为网址则改用 Ecoku 自己的样式表。 |
| `ecoku.pageSize` | `10` | 每页评论数，1 到 100。 |
| `ecoku.theme` | `auto` | `auto` 跟随页面配色，`light` 或 `dark` 固定配色。 |
| `ecoku.i18n` | 跟随页面语言 | 界面语言：`en`、`zh-CN` 或 `zh-Hant`。其他语言使用 Ecoku 站点的默认语言。 |

- 页面可以在 front matter 中用 `comments = false` 关闭评论。
- 评论按页面路径存储，例如 `/posts/my-post/`，所以请保持网址稳定。
- 读者滚动到评论区附近，或以 `#comments` 打开页面时，才会开始加载。

## 统计 {#analytics}

[Plausible Community Edition](https://github.com/plausible/analytics) 是自托管版的 Plausible。同样的设置也适用于托管服务 plausible.io。

{{< code-toggle file="hugo" >}}
[params.analytics]
  provider = 'plausible'
  [params.analytics.plausible]
    scriptURL = 'https://plausible.example.com/js/pa-XXXX.js'
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `provider` | `''` | `plausible`，留空则不开启统计。 |
| `plausible.scriptURL` | — | 必填。Plausible 为站点给出的安装代码中的脚本。 |
| `plausible.endpoint` | — | 事件上报地址，用于经过代理的部署。 |

脚本会加到每个页面，在任何环境下都是如此。Plausible 不记录来自 `localhost` 的访问，所以 `hugo server` 不会被计入。页面可以在 front matter 中用 `analytics = false` 关闭统计。

## 搜索引擎与社交预览 {#seo}

每个页面都会自动带上标题、描述、canonical 链接、指向各个翻译的 `hreflang` 链接、Open Graph 和 Twitter 卡片标签，以及 JSON-LD，无需任何配置。

描述取 front matter 的 `description`，没有就取正文开头，再没有就取 `params.description`。主要栏目中的文章是 Open Graph 的 `article`，其他页面都是 `website`。

### 社交预览图 {#social-image}

按顺序取第一个匹配项：

1. front matter `images` 的第一项。
2. 页面包中文件名含 `cover`、`feature` 或 `thumbnail` 的图片。
3. `params.images` 的第一项，即全站默认图。

宽于 1200px 的本地图片会被缩小，WebP、TIFF 和 BMP 会转成所有爬虫都能读取的 JPEG。受保护的文章没有预览图。

{{< code-toggle file="hugo" >}}
[params]
  images = ['og.png']
  [params.schema]
    twitterSite = '@handle'
{{< /code-toggle >}}

### 索引控制 {#indexing}

- 在生产环境以外，例如 `hugo server`，每个页面都标记为 `noindex, nofollow`。
- 页面 front matter 中的 `robotsNoIndex = true` 在生产环境下也有同样效果，并让该页面不进入站点地图。

### 站点验证 {#verification}

每个令牌都会在每个页面上生成一个 `<meta>` 标签。

{{< code-toggle file="hugo" >}}
[params.verification]
  google = 'token'
  bing = 'token'
  yandex = 'token'
  baidu = 'token'
  naver = 'token'
{{< /code-toggle >}}

### 结构化数据 {#structured-data}

| 页面 | JSON-LD 类型 |
| --- | --- |
| 首页 | `WebSite` |
| 主要栏目中的文章 | `BlogPosting` |
| 其他普通页面 | `WebPage`，或 front matter 中的 `schemaType`：`AboutPage`、`ContactPage`、`ProfilePage` 或 `FAQPage` |
| 栏目、分类法或词条 | `CollectionPage` |
| 搜索页 | `SearchResultsPage` |

除首页外，每个页面还带有面包屑导航。所有页面都指向同一个发布者：

{{< code-toggle file="hugo" >}}
[params.schema]
  publisherType = 'Person'
  sameAs = ['https://github.com/you', 'https://mastodon.social/@you']
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `publisherType` | `Person` | `Person` 使用 `params.author.name`，`Organization` 使用站点标题。 |
| `sameAs` | `params.social` 中的 `http(s)` 链接 | 发布者的个人主页网址。 |

### 站点地图 {#sitemap}

`sitemap.xml` 不包含设置了 `robotsNoIndex = true` 或 `sitemap.disable = true` 的页面、受保护的文章，以及没有公开文章的标签。列表页的日期取其中最新一篇文章的日期。`changefreq` 和 `priority` 取自 Hugo 的 `sitemap` 设置。

## robots.txt {#robots}

{{< code-toggle file="hugo" >}}
enableRobotsTXT = true

[params.robots]
  blockAI = true
{{< /code-toggle >}}

生产构建允许抓取所有路径，其他环境禁止抓取一切。文件中链接了站点地图。

`blockAI = true` 会增加一条记录，屏蔽已知的 AI 爬虫，例如 `GPTBot`、`ClaudeBot` 和 `CCBot`，搜索引擎不受影响。要修改名单，把 `layouts/_partials/func/ai-crawlers.html` 复制到站点中再编辑。

## RSS {#rss}

Hugo 为首页、每个栏目和每个词条生成订阅源。首页订阅源 `/index.xml` 只包含主要栏目中的文章。

{{< code-toggle file="hugo" >}}
[params.rss]
  fullText = true

[services.rss]
  limit = 20
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `params.rss.fullText` | `false` | `true` 在每个条目中附带全文。 |
| `services.rss.limit` | 不限 | 每个订阅源的条目数，属于 Hugo 的设置。 |

- 受保护的文章和设置了 `hiddenInRss = true` 的页面不会出现在订阅源里。
- 每个标签成为一个 `category`。频道图片是品牌图标，没有时取 `params.images` 的第一项。
- 全文条目会去掉按钮和播放器控件，并把链接改成绝对地址，确保在阅读器里可用。

开启全文后，文章里的链接也会进入订阅源：永远不要 [链接受保护的文章](/docs/protected-posts/#public)。

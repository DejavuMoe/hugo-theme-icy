+++
title = '配置'
description = '站点设置、菜单、站点参数和 front matter 键。'
weight = 20
date = 2026-11-24
images = ['covers/configuration.webp']
+++

每个参数 Icy 都有默认值，只写你想改的就行。只属于某个功能的参数和那个功能写在一起，见 [其他页面](#elsewhere)。

## Hugo 设置 {#hugo-settings}

Icy 用到的 Hugo 标准设置，写在 `[params]` 之外。Icy 需要的 `[markup]` 设置见 [快速开始](/docs/installation/#configure)。

| 设置 | 说明 |
| --- | --- |
| `mainSections` | 存放文章的栏目，例如 `['posts']`。见 [主要栏目](/docs/pages/#main-sections)。 |
| `hasCJKLanguage` | 用中文、日文或韩文写作时设为 `true`，字数和阅读时间才准确。 |
| `markup.goldmark.extensions.cjk` | 中文和日文用：段落内换行时不插入空格。 |
| `pagination.pagerSize` | 开启 [列表分页](/docs/pages/#lists) 时每页的文章数。 |
| `services.rss.limit` | 每个订阅源的最大条目数。 |
| `copyright` | 只用作 RSS 的 `<copyright>` 元素。页脚的 © 一行来自 [`params.footer`](#footer)。 |

用中文写作的站点加上：

{{< code-toggle file="hugo" >}}
hasCJKLanguage = true

[markup.goldmark.extensions.cjk]
  enable = true
  eastAsianLineBreaks = true
{{< /code-toggle >}}

## 菜单 {#menus}

Icy 读取两个菜单：页头的 `main` 和每页底部的 `footer`。每一项写上 `name`、`weight` 和链接目标。站内页面用 `pageRef`，它会跟随当前语言，并标出当前页面；其他链接用 `url`。

{{< code-toggle file="hugo" >}}
[[menus.main]]
  name = '文章'
  pageRef = '/posts'
  weight = 10
[[menus.main]]
  name = '标签'
  pageRef = '/tags'
  weight = 20

[[menus.footer]]
  name = '关于'
  pageRef = '/about'
  weight = 10
{{< /code-toggle >}}

- **页头：** 放得下时，链接排在站点名旁边；放不下时，收进菜单按钮，点开是一个全屏面板，语言和配色选项也在里面。指向搜索页的菜单项会被跳过，因为页头已经有搜索图标。
- **页脚：** 在 © 一行上方居中排成一行小号链接。不超过五个时，手机上也排得下一行。没有菜单项时，这一行不显示。

多语言站点要为每种语言分别定义菜单，见 [多语言](/docs/multilingual/#languages)。

## 站点参数 {#general}

下面的参数都写在 `[params]` 下。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `description` | 无 | 站点描述：首页的 meta description、RSS 频道描述，也是没有描述的页面的后备值。 |
| `shortName` | 站点标题 | Web 应用清单中的 `short_name`。 |
| `hideMeta` | `false` | 在所有页面隐藏日期、阅读时间和字数。 |

### 作者 {#author}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `author.name` | 站点标题 | 显示在首页简介、© 一行和版权卡片中，也是元数据里的作者。 |
| `author.avatar` | 无 | 首页简介的头像。`assets/` 中的图片会裁成正方形，`static/` 路径或 URL 原样使用。 |
| `author.bio` | 无 | 首页名字下方的一行介绍，支持 Markdown。 |

### 社交链接 {#social}

每个 `[[params.social]]` 条目在首页简介里加一个图标链接，带有 `rel="me"`。

| 键 | 说明 |
| --- | --- |
| `name` | 图标：`github`、`x`、`telegram`、`rss`，或 [你自己的图标](/docs/customization/#icons)。 |
| `url` | 链接地址。 |
| `title` | 无障碍名称，例如 `GitHub`。 |

{{< code-toggle file="hugo" >}}
[params.author]
  name = 'Ada'
  avatar = 'avatar.png'
  bio = '写字体，也写 **Web**。'

[[params.social]]
  name = 'github'
  title = 'GitHub'
  url = 'https://github.com/you'
[[params.social]]
  name = 'mastodon'
  title = 'Mastodon'
  url = 'https://mastodon.social/@you'
{{< /code-toggle >}}

### 文章 {#article}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `article.toc` | `true` | 目录：宽屏时在文章旁边，窄屏时收在按钮里。 |
| `article.tocMinHeadings` | `2` | 标题至少有这么多个才显示目录。 |
| `article.tocMaxLevel` | `3` | 目录列出的最深标题级别，总是从 `h2` 开始。 |
| `article.readingTime` | `true` | 显示阅读时间。 |
| `article.wordCount` | `true` | 显示字数。 |
| `article.cover` | `true` | 在文章顶部显示封面图。 |
| `article.imageViewer` | `true` | 点击图片时用全屏查看器打开。 |

设置 `license` 后，主要栏目中的每篇文章末尾都会有一张版权卡片，包含标题、链接、作者、日期和许可协议。[示例](/posts/) 里的文章都有。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `article.copyright.license` | 无 | 许可协议名称，例如 `'CC BY 4.0'`。 |
| `article.copyright.url` | 无 | 让协议名称成为链接。 |
| `article.copyright.note` | 无 | 卡片底部的附加一行，支持 Markdown。 |

{{< code-toggle file="hugo" >}}
[params.article.copyright]
  license = 'CC BY-NC 4.0'
  url = 'https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans'
  note = '转载或引用本文时请遵守许可协议，注明出处，不得用于商业用途。'
{{< /code-toggle >}}

多语言站点可以把 `note` 写进各语言自己的 `params.article.copyright`，卡片就会跟着页面语言切换。协议页面有译本时，`url` 也可以这样分开写。见 [语言](/docs/multilingual/#languages)。

#### 二维码 {#qrcodes}

添加 `article.qrcodes` 后，版权卡片上方会出现几个小按钮，比如微信公众号和打赏码。鼠标悬停、点击或轻触按钮，就会显示它的方形图片，图片原样发布。[示例](/posts/) 里的文章有两个。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `icon` | `'qrcode'` | 一个 [图标](/docs/customization/#icons)。主题还自带 `wechat` 和 `coffee`。 |
| `label` | 无 | 按钮文字。留空时是只有图标的圆形按钮。 |
| `image` | 无 | `assets/` 或 `static/` 中的方形图片，也可以是 URL，必填。 |
| `caption` | 无 | 图片下方的一行文字，支持 Markdown。没有 `label` 时必填，读屏软件用它称呼按钮。 |

{{< code-toggle file="hugo" >}}
[[params.article.qrcodes]]
  icon = 'wechat'
  label = '公众号'
  image = 'qrcodes/wechat.png'
  caption = '扫码关注'
[[params.article.qrcodes]]
  icon = 'coffee'
  label = '打赏'
  image = 'qrcodes/tip.png'
{{< /code-toggle >}}

多语言站点可以把这个列表写进各语言自己的 params，按钮文字用对应的语言。

### 页脚 {#footer}

页脚居中，每行一项：[页脚菜单](#menus)、`© <since>–<今年> <author.name>`、“Powered by Hugo & Icy”、致谢和你自己的文字。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `footer.copyright` | `true` | 显示 © 一行。 |
| `footer.since` | 最早页面的年份 | © 年份范围的起始年。 |
| `footer.poweredBy` | `true` | 显示“Powered by Hugo & Icy”。 |
| `footer.text` | 无 | 附加的一行文字，支持 Markdown。 |
| `footer.credit.prefix` | 无 | 致谢链接前的文字，例如 `'托管于'`。 |
| `footer.credit.name` | 无 | 链接文字，或图标的无障碍名称。 |
| `footer.credit.url` | 无 | 致谢链接。 |
| `footer.credit.icon` | 无 | 代替名称显示的 [图标](/docs/customization/#icons)。 |
| `footer.credit.suffix` | 无 | 致谢链接后的文字。 |

{{< code-toggle file="hugo" >}}
[params.footer]
  since = 2019
  [params.footer.credit]
    prefix = '托管于'
    name = 'Cloudflare'
    url = 'https://pages.cloudflare.com/'
    icon = 'cloudflare'
{{< /code-toggle >}}

### 预加载 {#speculation-rules}

读者即将点击站内链接时，支持的浏览器会提前开始加载那个页面。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `speculationRules.enable` | `true` | 开启或关闭预加载。 |
| `speculationRules.action` | `'prefetch'` | `prefetch` 或 `prerender`。 |
| `speculationRules.eagerness` | `'moderate'` | `conservative`、`moderate`、`eager` 或 `immediate`。 |

带有 `rel="nofollow"`、`download` 属性或 `data-no-speculate` 属性的链接不会被提前加载。

## Front matter {#front-matter}

页面级的键。和某个站点参数作用相同时，页面上的键优先。

### 显示 {#display}

| 键 | 说明 |
| --- | --- |
| `title` | 页面标题。 |
| `description` | 一句话，用于搜索引擎、社交卡片、搜索结果和 RSS。栏目页和标签页还会把它显示在标题下方。没有时使用摘要。 |
| `date`、`lastmod` | 发布日期。`lastmod` 晚于发布那天时，会加上“更新于……”。 |
| `draft` | 显示“草稿”标记。正式构建不输出草稿。 |
| `tags` | 以 `#标签` 链接显示在元信息下方。 |
| `weight` | 在非主要栏目中的排序，比如这套文档。 |
| `toc` | 显示或隐藏目录。 |
| `hideMeta` | 隐藏日期、阅读时间和字数。 |
| `images` | 封面和社交分享图，见 [封面](/docs/media/#covers)。 |
| `hideCover` | 页面上不显示封面，但它仍是社交分享图。 |

### 版权卡片 {#copyright-card}

| 键 | 说明 |
| --- | --- |
| `original` | `false` 表示转载，并隐藏卡片。 |
| `copyright` | `false` 隐藏卡片。 |
| `license` | 只用于这篇文章的许可协议。 |
| `qrcodes` | `false` 隐藏 [二维码按钮](#qrcodes)。 |

### 可见性 {#visibility}

| 键 | 说明 |
| --- | --- |
| `hiddenInHomeList` | 不出现在首页的最近文章中。 |
| `searchHidden` | 不进入搜索索引。 |
| `hiddenInRss` | 不进入 RSS 订阅源。 |
| `robotsNoIndex` | 加上 `noindex, nofollow`，并且不进入 sitemap。 |
| `sitemap.disable` | Hugo 自带的键：只是不进入 sitemap。 |
| `comments` | `false` 关闭评论。 |
| `analytics` | `false` 关闭统计。 |

### 特殊页面 {#special-pages}

| 键 | 说明 |
| --- | --- |
| `layout` | `search`、`friends` 或 `changelog`，见 [页面](/docs/pages/)。 |
| `placeholder` | 搜索页：搜索框的占位文字。 |
| `changes` | 更新日志页：条目包含 `date`、`title` 和可选的 `summary`。 |
| `initial` | 标签页：标签归入哪个字母，见 [标签](/docs/pages/#tags)。 |
| `schemaType` | 主要栏目以外页面的结构化数据类型：默认 `WebPage`，也可以是 `AboutPage`、`ContactPage`、`ProfilePage`、`FAQPage`。文章始终是 `BlogPosting`。 |
| `protected` | 密码保护，见 [受保护文章](/docs/protected-posts/#protect)。 |

比如一个关于页面：

{{< code-toggle fm=true >}}
title = '关于'
schemaType = 'AboutPage'
toc = false
comments = false
{{< /code-toggle >}}

## 错误 {#errors}

Icy 会忽略它不认识的参数。某项设置没有生效时，检查拼写和它所在的表。TOML 里，表头 `[table]` 之后的每个键都属于这个表，所以 `mainSections` 这样的顶层键要写在第一个表头之前。

Icy 无法使用的值会中断构建，错误信息会指出是哪一项。例如：

- 短代码用了不存在的参数，或找不到要用的图片；
- 主题色不是 `#rgb` 或 `#rrggbb`，或品牌图标不在 `assets/` 中；
- 评论或统计服务名称未知，或缺少必填设置；
- 受保护页面没有密码，或 `schemaType` 不受支持；
- 友链缺少 `name` 或 `url`，或更新日志条目缺少 `date` 或 `title`。

小问题只产生警告，比如强调色写法不对、图标不是正方形。用 `--panicOnWarning` 构建时，任何警告都会变成错误。

## 其他页面 {#elsewhere}

下面这些设置和参数与各自的功能写在一起。

| 键 | 见 |
| --- | --- |
| `params.home` | [首页](/docs/pages/#home) |
| `params.list` | [列表](/docs/pages/#lists) |
| `params.search` | [搜索](/docs/pages/#search) |
| `params.friends` | [友链](/docs/pages/#friends) |
| `params.livePhoto` | [实况照片](/docs/media/#live-photo) |
| `params.repo` | [仓库卡片](/docs/writing/#repo) |
| `params.comments` | [评论](/docs/integrations/#ecoku) |
| `params.analytics` | [统计](/docs/integrations/#analytics) |
| `params.images`、`params.schema`、`params.verification` | [SEO](/docs/integrations/#seo) |
| `enableRobotsTXT`、`params.robots` | [robots.txt](/docs/integrations/#robots) |
| `params.rss` | [RSS](/docs/integrations/#rss) |
| `params.wechat` | [微信公众号](/docs/integrations/#wechat) |
| `params.style` | [强调色](/docs/customization/#accent) |
| `params.colorScheme` | [浅色与深色](/docs/customization/#color-scheme) |
| `params.fonts` | [字体](/docs/customization/#fonts) |
| `params.brand` | [站点图标与字标](/docs/customization/#brand) |
| `languages`、`params.languageShort` | [多语言](/docs/multilingual/) |
| `ignoreLogs` | [网络访问](/docs/deployment/#network) 和 [受保护文章的警告](/docs/protected-posts/#warning) |
| `caches` | [缓存](/docs/deployment/#caches) |

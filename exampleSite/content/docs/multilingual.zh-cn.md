+++
title = '多语言'
description = '让你的站点支持多种语言。'
weight = 80
date = 2026-11-24
images = ['covers/multilingual.webp']
+++

每种语言都是一个独立的 Hugo 站点，有自己的菜单、参数、订阅源和搜索索引。Icy 在页头加上语言切换，并输出搜索引擎需要的备用语言链接。本站就是双语的，试试页头的 中 / EN 切换。

## 语言 {#languages}

在 `[languages]` 下声明每种语言。顶层的 `[params]` 由所有语言共用，各语言不同的部分写进它自己的 `params` 和 `menus`：

{{< code-toggle file="hugo" >}}
defaultContentLanguage = 'en'
hasCJKLanguage = true

[languages]
  [languages.en]
    locale = 'en'
    label = 'English'
    weight = 1
    [languages.en.params]
      description = 'Notes on whatever I am learning.'

  [languages.zh-cn]
    locale = 'zh-CN'
    label = '简体中文'
    weight = 2
    [languages.zh-cn.params]
      description = '学习笔记。'
      languageShort = '中'
      [languages.zh-cn.params.author]
        bio = '一句话介绍。'

[languages.en.menus]
  [[languages.en.menus.main]]
    name = 'Posts'
    pageRef = '/posts'
    weight = 10

[languages.zh-cn.menus]
  [[languages.zh-cn.menus.main]]
    name = '文章'
    pageRef = '/posts'
    weight = 10
{{< /code-toggle >}}

| 键 | 说明 |
| --- | --- |
| `locale` | 页面的 `lang`，它也决定默认字体。同时用于 `hreflang`、`og:locale` 和 RSS 的语言。没有时使用语言键。 |
| `label` | 语言切换中这种语言的名称，供屏幕阅读器读出，也是鼠标悬停时的提示。 |
| `direction` | `ltr` 或 `rtl`。 |
| `params` | 逐键覆盖顶层的 `[params]`。一种语言只设置了 `fonts.sans`，仍会从顶层得到 `fonts.stylesheets`。 |
| `menus` | 这种语言的页头和页脚菜单。`pageRef` 会解析到这种语言中的页面。 |

## 译文 {#translations}

译文的文件名沿用默认语言的文件名，在扩展名前加上语言键：

```text
content/
├── about.md                 英文
├── about.zh-cn.md           简体中文
└── posts/
    └── hello/
        ├── index.md         英文
        ├── index.zh-cn.md   简体中文
        └── photo.jpg        两种语言共用
```

路径相同的文件互为译文。文件名不同时，给它们设置相同的 `translationKey` 即可配对。页面不必每种语言都有译文。

> [!WARNING]
>
> 页面包只有在包含默认语言的 `index.md` 时，才会在各个译文之间共用图片。只有 `index.zh-cn.md` 的页面包找不到自己的图片，构建会失败。补一个默认语言的 `index.md`，或者把文章写成单个文件，图片放进 `assets/` 或 `static/`。

## 语言切换 {#language-switch}

页头为其他每种语言显示一个简短代码，链接到当前页面在那种语言中的译文；没有译文时，链接到那种语言的首页。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `languageShort` | 语言键的前两个字母，大写 | 这种语言在切换中显示的代码，按语言设置。 |

{{< code-toggle file="hugo" >}}
[languages.zh-cn.params]
  languageShort = '中'
{{< /code-toggle >}}

语言切换会占用页头的宽度，语言较多时，链接会更早收进菜单按钮。

## 每种语言各自得到什么 {#per-language}

| 功能 | 行为 |
| --- | --- |
| 备用语言链接 | 每个页面用 `hreflang` 链接它的译文。 |
| 搜索 | 每种语言一份索引。每种语言都要有搜索页，例如 `search.md` 和 `search.zh-cn.md`。 |
| RSS | 每种语言一组订阅源：`/index.xml`、`/zh-cn/index.xml` 等。 |
| Sitemap | 每种语言一个，由 `/sitemap.xml` 处的 sitemap 索引统一列出。 |
| 标签 | 按语言区分，见 [标签](/docs/pages/#tags)。 |
| 字体 | 默认字体跟随页面语言，见 [按语言设置字体](/docs/customization/#fonts-per-language)。 |
| 界面文字 | 来自这种语言的 i18n 文件，见 [界面文字](/docs/customization/#strings)。 |

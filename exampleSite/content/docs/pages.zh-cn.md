+++
title = '页面'
description = '设置首页、归档、标签、搜索、友链、更新日志等页面。'
weight = 50
date = 2026-11-24
images = ['covers/pages.webp']
+++

## 主要栏目 {#main-sections}

Icy 把 Hugo 的 `mainSections` 中的页面当作博客文章。它们会出现在首页和首页订阅源里，并带有按年归档、版权卡片和 Open Graph 的 `article` 类型。Hugo 会按页面最多的栏目自行推断这个设置，所以请明确写出来：

{{< code-toggle file="hugo" >}}
mainSections = ['posts']
{{< /code-toggle >}}

## 首页 {#home}

首页从上到下依次是：

1. 作者简介：头像、名字、简介和社交链接，在 [配置](/docs/configuration/#author) 中设置。
2. `content/_index.md` 的正文，如果有的话。
3. 主要栏目中的最近文章，每篇一行。列表没有列全时，会出现“全部文章”链接。

{{< code-toggle file="hugo" >}}
[params.home]
  intro = true
  recentCount = 8
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `intro` | `true` | `false` 隐藏作者简介。 |
| `title` | `params.author.name` | 简介的标题。 |
| `bio` | `params.author.bio` | 简介的文字，支持 Markdown。 |
| `recentCount` | `8` | 最近文章的篇数，`0` 表示全部列出。 |

想让某篇文章不上首页、但仍留在归档里，在它的 front matter 中设置 `hiddenInHomeList = true`。

## 归档与栏目列表 {#lists}

主要栏目以及每个标签、分类页面，都是按年分组的归档。副标题显示文章数；栏目设置了 `description` 时改为显示描述。草稿和受保护的文章会带一个小标签。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `params.list.groupByYear` | `true` | `false` 把所有文章排成一个列表，显示完整日期。 |
| `params.list.paginate` | `false` | `true` 按 `pagination.pagerSize` 篇一页分页。 |

其他栏目按 `weight` 列出其中的页面，比如这份文档，每项附带描述。两种情况下，栏目 `_index.md` 的正文都显示在列表上方。

## 标签 {#tags}

`/tags/` 的标签索引就像书后的索引。标签按首字母分组：先是数字，然后是 A–Z，其余的归入“#”。每行显示标签名和文章数。

受保护的文章不计入，只被受保护文章使用的标签不会出现。分类及其他分类法使用同样的版式。要设置索引页的标题、描述或引言，创建 `content/tags/_index.md`。

### 中文标签名 {#chinese-tag-names}

在简体中文站点上，以汉字开头的标签按拼音首字母归组：“图片”（tú）归入 T，和“Typography”相邻。在其他站点上，非拉丁文字的标签归入“#”。

首字母只看第一个字，多音字可能被归错组。这时在标签的词条页面里设置 `initial`：

{{< code-toggle file="content/tags/重庆/_index" fm=true >}}
title = '重庆'
initial = 'C'
{{< /code-toggle >}}

`initial` 是一个字母或数字。多语言站点请写在对应语言的词条页面里，例如 `content/tags/重庆/_index.zh-cn.md`。

## 搜索 {#search}

搜索在浏览器中进行，索引随站点一起构建。可以在本站的 [搜索页](/search/) 试试。创建这个页面：

{{< code-toggle file="content/search" fm=true >}}
title = '搜索'
layout = 'search'
searchHidden = true
toc = false
placeholder = '搜索标题、标签与正文'
{{< /code-toggle >}}

页面存在后，页眉会出现搜索图标。`placeholder` 可以不写；页面正文显示在标题下方。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `params.search.page` | `/search` | 页眉搜索图标链接的页面。 |
| `params.search.maxResults` | `20` | 最多显示的结果数。 |
| `params.search.contentLimit` | `20000` | 每个页面索引的正文字符数。 |

- 输入的每个词都必须匹配。不区分大小写，也能匹配词语内部，所以中文和日文无需分词。
- 标题匹配排在最前，其次是标签、摘要和正文。
- 查询词保留在地址里，例如 `/search/?q=hugo`，搜索结果可以直接分享。
- 所有普通页面都会被索引，用 `searchHidden = true` 排除某个页面。受保护的文章从不被索引。
- 每种语言有各自的索引。搜索需要 JavaScript。

## 友链 {#friends}

一个链接到其他网站的页面，数据来自 `data/friends.yaml`。本站的 [谁在使用 Icy](/friends/) 就是一例。创建一个使用 `friends` 布局的页面：

{{< code-toggle file="content/friends/_index" fm=true >}}
title = '朋友'
description = '我常读的网站。'
layout = 'friends'
{{< /code-toggle >}}

页面正文显示在列表上方。在数据文件中列出网站：

```yaml {title="data/friends.yaml"}
- name: Hugo
  url: https://gohugo.io/
  avatar: https://github.com/gohugoio.png
  description: The world's fastest framework for building websites.
- name: 一位朋友
  url: https://example.com/
  avatar: friends/alex.png       # assets/friends/alex.png
  description:
    en: Notes on gardening and code.
    zh-cn: 关于园艺和代码的笔记。
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 网站或人的名字。 |
| `url` | 是 | `http` 或 `https` 链接。 |
| `avatar` | 否 | 图片路径或网址，与其他 [媒体路径](/docs/media/#sources) 相同。 |
| `description` | 否 | 最多显示两行。可以是字符串，也可以按语言代码各写一段。 |

- 头像裁成 96px。远程头像在构建时下载，读者不会访问原始主机。
- 没有头像或下载失败时，显示名字的第一个字。
- 缺少 `name` 或 `url`，或网址不是 `http(s)`，构建会失败。
- 设置 `params.friends.ref` 可以给每个链接加上 `ref` 查询参数，例如 `?ref=https://example.com`。留空则不改动链接。本来就带 `ref` 的链接保留它自己的值。
- 如果这个页面是栏目，它的子页面会列在友链下方。

## 更新日志 {#changelog}

按日期记录的站点变更，写在页面的 front matter 里。本站的 [更新日志](/changelog/) 就是一例。

{{< code-toggle file="content/changelog" fm=true >}}
title = '更新日志'
layout = 'changelog'
searchHidden = true

[[changes]]
date = 2026-11-23
title = '换用 Icy 主题'
summary = '资源现在 **按功能** 加载。'

[[changes]]
date = 2026-08-14
title = '自托管评论'
{{< /code-toggle >}}

每个条目都必须有 `date` 和 `title`，否则构建失败。`summary` 可选，两者都支持行内 Markdown。条目按年分组、新的在前，显示在页面正文下方。

## 关于页及其他单页 {#about}

`content/about.md` 这样的页面是主要栏目之外的普通页面。它没有版权卡片，也不会出现在首页和首页订阅源里。这类页面常用下面几个 front matter 键：

{{< code-toggle file="content/about" fm=true >}}
title = '关于'
toc = false
hideMeta = true
comments = false
schemaType = 'AboutPage'
{{< /code-toggle >}}

全部页面级的键见 [配置](/docs/configuration/#front-matter)。

## 404 页面 {#not-found}

Hugo 在站点根目录生成 `404.html`，多语言站点还会在每种语言的前缀下各生成一个。它只有一句提示和返回首页的链接。缺失的路径要由 Web 服务器返回这个文件，见 [部署](/docs/deployment/#headers)。

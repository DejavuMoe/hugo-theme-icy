+++
title = '快速开始'
description = '安装、配置 Icy，发布第一篇文章。'
weight = 10
date = 2026-11-24
images = ['covers/installation.webp']
+++

## 环境要求 {#requirements}

- [Hugo](https://gohugo.io/installation/) 0.158.0 或更新版本，标准版即可。
- Git，用来添加主题。
- Node.js，只有发布 [受保护文章](/docs/protected-posts/) 时才需要。

## 安装 {#install}

还没有站点的话，先新建一个，之后的命令都在站点目录里运行：

```sh
hugo new project my-blog
cd my-blog
git init
```

然后添加主题：

{{< tabs label="添加主题" >}}
{{< tab title="Git 子模块" >}}
推荐的方式：

```sh
git submodule add https://github.com/DejavuMoe/hugo-theme-icy.git themes/hugo-theme-icy
```

以后克隆站点时，用 `git clone --recurse-submodules` 连主题一起取回。
{{< /tab >}}
{{< tab title="Hugo 模块" >}}
需要先装 [Go](https://go.dev/dl/)。把站点初始化为模块，只需一次：

```sh
hugo mod init github.com/you/my-blog
```

在下面的配置里，把 `theme = 'hugo-theme-icy'` 换成：

```toml
[module]
  [[module.imports]]
    path = 'github.com/DejavuMoe/hugo-theme-icy'
```

这样主题放在 Hugo 的模块缓存里。文档中以 `node themes/hugo-theme-icy/` 开头的命令，要换成缓存里的路径。
{{< /tab >}}
{{< tab title="ZIP" >}}
下载 [仓库的 ZIP 压缩包](https://github.com/DejavuMoe/hugo-theme-icy/archive/refs/heads/master.zip)，解压后把文件夹改名为站点里的 `themes/hugo-theme-icy`。
{{< /tab >}}
{{< /tabs >}}

## 配置 {#configure}

把 `hugo.toml` 的内容换成下面这些，再改成你自己的值：

{{< code-toggle file="hugo" >}}
baseURL = 'https://example.com/'
title = '我的博客'
theme = 'hugo-theme-icy'
mainSections = ['posts']

[markup.goldmark.parser]
  wrapStandAloneImageWithinParagraph = false
  [markup.goldmark.parser.attribute]
    block = true

[[menus.main]]
  name = '文章'
  pageRef = '/posts'
  weight = 10

[params]
  description = '学习笔记。'
  [params.author]
    name = '你的名字'
    bio = '一句话介绍自己。'
{{< /code-toggle >}}

Hugo 不读取主题里的 `[markup]` 设置，所以下面两项必须写在你自己的配置里：

| 设置 | 作用 |
| --- | --- |
| `wrapStandAloneImageWithinParagraph = false` | 单独成行的图片渲染为图像块。缺了它，图片会变成夹在文字里的小图。 |
| `attribute.block = true` | 允许在段落、图片或表格的下一行写 `{.align-center}` 这样的属性。 |

用中文、日文或韩文写作时，还要加上 [这几项 Hugo 设置](/docs/configuration/#hugo-settings)。其余设置见 [配置](/docs/configuration/)。

## 写第一篇文章 {#first-post}

```sh
hugo new posts/hello-world.md
```

这会按主题的文章模板生成 `content/posts/hello-world.md`，front matter 里注释掉的几行列出了可选的键。正文写在 front matter 下面：

```markdown
---
title: '你好，世界'
date: 2026-11-24T10:00:00+08:00
draft: true
summary: ''
tags: ['随笔']
---

我用 **Icy** 写的第一篇文章。
```

新文章默认是草稿，改成 `draft: false` 才会发布。文章要带自己的图片时，改建一个文件夹：`hugo new posts/hello-world/index.md`，图片放在 `index.md` 旁边。详见 [媒体](/docs/media/#sources)。

## 本地预览 {#preview}

```sh
hugo server -D
```

打开 <http://localhost:1313/>。保存文件后页面自动刷新，`-D` 表示包含草稿。

## 构建 {#build}

```sh
hugo --gc --minify
```

生成的网站在 `public/` 里。怎样发布，见 [部署](/docs/deployment/)。

## 更新 {#update}

先看一眼 [更新日志](/changelog/)，再运行：

{{< tabs label="更新主题" >}}
{{< tab title="Git 子模块" >}}
```sh
git submodule update --remote themes/hugo-theme-icy
```
{{< /tab >}}
{{< tab title="Hugo 模块" >}}
```sh
hugo mod get -u github.com/DejavuMoe/hugo-theme-icy
hugo mod tidy
```
{{< /tab >}}
{{< tab title="ZIP" >}}
用新下载的副本替换 `themes/hugo-theme-icy` 文件夹。
{{< /tab >}}
{{< /tabs >}}

更新不会动你自己的 `assets/`、`layouts/` 和 `i18n/`。如果你把主题模板复制到了 `layouts/`，记得和新版本对比一下。

## 问问 AI {#ai}

全部文档合成了一个文件，方便 AI 助手阅读：<https://icy.zsh.moe/zh-cn/llms-full.txt>。英文版是 <https://icy.zsh.moe/llms-full.txt>。把链接交给 AI 助手，再附上类似这样的提示词：

```text
请阅读 https://icy.zsh.moe/zh-cn/llms-full.txt
然后帮我用 Icy 主题新建一个 Hugo 站点，
写一份 hugo.toml：填上我的名字和
GitHub 链接，开启搜索。
```

```text
请阅读 https://icy.zsh.moe/zh-cn/llms-full.txt
这是我的 hugo.toml：[粘贴在这里]
哪里写错了、缺了什么？
```

```text
请阅读 https://icy.zsh.moe/zh-cn/llms-full.txt
我想 [用自己的字体]。要在站点里新建
哪些文件、写什么内容？不要改动主题。
```

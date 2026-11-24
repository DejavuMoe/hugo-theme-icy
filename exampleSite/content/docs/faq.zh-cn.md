+++
title = '常见问题'
description = '最常遇到的问题和解决办法。'
weight = 110
date = 2026-11-24
images = ['covers/faq.webp']
+++

## 图片很小，夹在一行文字中间 {#tiny-images}

你的 `hugo.toml` 缺了 `wrapStandAloneImageWithinParagraph = false`。Hugo 不读取主题的 `[markup]` 设置，只能自己加上。见 [快速开始](/docs/installation/#configure)。

## 首页列出的页面不对 {#wrong-home-pages}

把 `mainSections` 设为存放文章的栏目。不设置时，Hugo 会挑页面最多的那个栏目。见 [页面](/docs/pages/#main-sections)。

## 构建报错，提到某个参数 {#parameter-error}

先读报错信息：它会指出是哪项设置或哪个短代码，通常还有文件和行号。最常见的原因是短代码参数拼错，或者路径不存在。见 [配置](/docs/configuration/#errors)。

## 某项设置不起作用 {#setting-ignored}

Hugo 会悄悄忽略它不认识的站点参数，所以先检查拼写。用 TOML 时还要看键的位置：写在 `[params.author]` 这类表头下面的键都属于那张表，所以 `mainSections` 这样的顶层键要写在第一个表头之前。

## 提示框的自定义标题不见了 {#alert-title}

开启 CJK 换行处理的站点上，Hugo 会把标题行和下一行连在一起，于是整段文字都显示成默认标题下的正文。在标题行后面空一行 `>`：

```markdown
> [!WARNING] 先备份
>
> 正文从这里开始。
```

见 [写作](/docs/writing/#alerts)。

## 有受保护文章时 `--panicOnWarning` 构建失败 {#protected-warning}

受保护文章在密封之前，正式构建会为每一篇发出警告。如果你部署的每次构建都会运行密封和校验脚本，就用 `ignoreLogs` 屏蔽这条警告。见 [受保护文章](/docs/protected-posts/#warning)。

## 没有网络时构建失败 {#offline-build}

仓库卡片、YouTube 缩略图和远程图片都在构建时下载。下载失败时页面会退回到备用内容，Hugo 记录一条 `icy-remote-fetch` 警告，而 `--panicOnWarning` 会把它变成错误。CI 可能断网的话，把这个 id 加进 `ignoreLogs`。见 [部署](/docs/deployment/#network)。

## 怎样更新主题？ {#update}

先看更新日志，再按当初的安装方式取回新版本。见 [快速开始](/docs/installation/#update)。

## 手机上菜单链接不见了 {#phone-header}

链接和站点名排不下一行时，页头只保留搜索和菜单按钮。点菜单按钮，链接会在全屏面板里展开，语言和配色选项在面板底部。见 [配置](/docs/configuration/#menus)。

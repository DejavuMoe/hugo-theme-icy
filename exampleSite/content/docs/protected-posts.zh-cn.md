+++
title = '受保护文章'
description = '用密码锁住文章，并安全地部署。'
weight = 60
date = 2026-11-24
images = ['covers/protected-posts.webp']
+++

受保护的文章只显示标题和一个密码框。构建之后，一个脚本会加密文章和页面包里的每个文件，读者输入正确的密码后由浏览器解密。[示例](/posts/) 里有一篇《加密文章示例》可以试试，它的提示已经把密码透露出来了。

它能挡住随手翻看的读者，挡不住刻意破解的人。使用前请先读 [安全性](#security)。

## 保护一篇文章 {#protect}

受保护的文章必须是叶子页面包（leaf bundle）：一个包含 `index.md` 和文章所用文件的目录。

```text
content/posts/secret/
├── index.md
├── photo.jpg
└── notes.pdf
```

在 front matter 中开启保护。front matter 之后的全部内容和目录里的每个文件都会被加密。

{{< code-toggle file="content/posts/secret/index" fm=true >}}
title = '秘密'
date = 2026-11-21
[protected]
  enabled = true
  password = '一段足够长的密码短语'
  hint = '显示在密码框上方'
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `enabled` | `false` | `true` 开启保护。 |
| `password` | — | 必填，缺少会让构建失败。请使用较长的密码短语。 |
| `hint` | — | 显示在密码框上方，公开可见。 |

只有页面包里的文件会被加密。`static/`、`assets/` 或其他页面包里的文件、远程图片的本地副本，以及远程音视频，都仍然公开。不要给受保护的文章设置封面图，它不会显示。

## 哪些仍然公开 {#public}

| 公开 | 加密 |
| --- | --- |
| 标题、日期和提示 | 正文 |
| 归档、标签页和首页里的条目 | 页面包里的每个文件及其缩放版本 |
| 评论和统计（如果开启） | |

受保护的文章没有目录、标签、封面、社交预览图、版权卡片和结构化数据。它带有 `noindex` 标记，不进入搜索、订阅源、站点地图和标签计数。如果也不想显示评论或加载统计，设置 `comments = false` 或 `analytics = false`。

> [!WARNING]
>
> 永远不要在公开页面里链接受保护的文章。开启全文 RSS 时，这个链接会进入订阅源，而 `verify.mjs` 在那里发现任何受保护的路由都会报错。需要提到它时，直接写文章名称。

## 翻译 {#translations}

在多语言站点上，一篇文章的翻译要么全部保护，要么都不保护。每个翻译都需要自己的 `[protected]` 表，密码可以不同。各个翻译共用页面包里的文件，只保护一部分会让封存失败，或者让这些文件以明文发布。

## 封存与校验 {#seal}

加密是 `hugo` 之后的一步。在本地和 CI 里都执行这三条命令：

```sh
hugo --gc --minify --cleanDestinationDir
node themes/hugo-theme-icy/tools/protect/seal.mjs public
node themes/hugo-theme-icy/tools/protect/verify.mjs public
```

- `seal.mjs` 加密每篇受保护的文章，删除明文，并删除只列出受保护文章的标签页。`--dry-run` 只显示将要做的事。
- `verify.mjs` 检查每篇受保护的文章都已封存，且订阅源、站点地图和搜索索引里没有受保护的路由。有任何错误时以退出码 1 结束。

务必构建到干净的目录，否则 `seal.mjs` 会停止。受保护的文章不是叶子页面包，或者公开页面用到了它的文件时，它也会停止，不做任何修改。[部署](/docs/deployment/) 中有包含这些步骤的完整流程。

## 预览封存后的站点 {#preview}

`hugo server` 不会封存，所以看不到真正的解密过程。`preview.mjs` 会构建、封存、校验，然后在本地提供结果：

```sh
node themes/hugo-theme-icy/tools/protect/preview.mjs
```

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `--site DIR` | 当前目录 | Hugo 站点。 |
| `--destination DIR` | `<site>/public` | 输出目录，须位于站点内，会被清空。 |
| `--drafts` | 关 | 包括草稿和未来日期的文章。 |
| `--build-only` | 关 | 校验后停止。 |
| `--no-build` | 关 | 直接提供已封存的输出。 |
| `--port N` | `1313` | 端口。 |
| `--host H` | `127.0.0.1` | 地址。 |

## 构建警告 {#warning}

生产构建会为每篇受保护的文章输出一条警告，提醒你封存：

```text
WARN icy: /posts/secret/ is password-protected; run tools/protect/seal.mjs (and verify.mjs) on the output before deploying
```

带 `--panicOnWarning` 的构建会因此失败。每条部署流程都会封存和校验之后，屏蔽它：

{{< code-toggle file="hugo" >}}
ignoreLogs = ['icy-protected-unsealed']
{{< /code-toggle >}}

## 安全性 {#security}

这是在浏览器端隐藏内容，不是服务器端的访问控制。密文是公开的，弱密码可以被离线猜出，解锁文章的人也能复制内容。密码不会离开浏览器，也不会被保存。

加密格式和密码学细节见作者的文章 [Hugo 实现页面加密](https://blog.dejavu.moe/posts/hugo-protected-leaf-bundle-encryption/)。

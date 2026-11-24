+++
title = '写作'
description = '用于文字、代码和图表的 Markdown 增强与短代码。'
weight = 30
date = 2026-11-24
images = ['covers/writing.webp']
+++

Icy 在普通 Markdown 之上加了几项增强，还带有一小组短代码。下面每一项都先给出实际效果，再给出源码。图片、音频和视频见 [媒体](/docs/media/)。

短代码参数用命名形式，表格注明可以按位置传入的除外。参数名未知或取值无效时构建失败，见 [错误检查](/docs/configuration/#errors)。

## 目录 {#toc}

在宽屏上，文章旁边显示目录，并高亮当前阅读的小节。在窄屏上，目录从一个浮动按钮打开。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `params.article.toc` | `true` | 全站开关。 |
| `params.article.tocMinHeadings` | `2` | 标题少于这个数时不显示目录。 |
| `params.article.tocMaxLevel` | `3` | 列入目录的最深标题级别。 |
| front matter 中的 `toc` | — | `false` 在单个页面隐藏目录，`true` 在站点默认关闭时也显示。 |

Hugo 的 `markup.tableOfContents` 设置对它不起作用。受保护文章从不显示目录。

每个标题都有 id，悬停时出现 `#` 链接。用标题属性可以自己指定 id 或 class：

```markdown
## 安装主题 {#install .special}
```

## 链接 {#links}

站内链接直接写站点路径。Icy 会把它指向当前语言的页面，所以同一段 Markdown 在每种翻译里都能用。

```markdown
参见 [媒体](/docs/media/#figure) 和 [示例](/posts/)。
```

指向页面和页面资源的相对链接也可以用，例如 `[下一篇](../other-post/)` 或 `[幻灯片](deck.pdf)`。不对应任何页面的路径保持原样，例如 `static/` 里的文件。外部链接在当前标签页打开，不加图标。

## 提示块 {#alerts}

GitHub 风格的提示块会渲染成带底色的卡片。写在类型后面的文字会替换默认标题。

> [!NOTE]
> 读者即使只是快速浏览，也应该知道的信息。

> [!WARNING] 先备份
>
> 修改配置之前，先保存一份副本。

```markdown
> [!NOTE]
> 读者即使只是快速浏览，也应该知道的信息。

> [!WARNING] 先备份
>
> 修改配置之前，先保存一份副本。
```

类型有 `NOTE`、`TIP`、`IMPORTANT`、`WARNING` 和 `CAUTION`，各有自己的颜色。要修改默认标题，见 [界面文字](/docs/customization/#strings)。

开启 `markup.goldmark.extensions.cjk.eastAsianLineBreaks` 后，自定义标题下面要空一行 `>`，否则 Hugo 会把标题和下一行连在一起。

## 引用 {#quotes}

引用块的最后一段以 `——` 或 `— ` 开头时，会变成右对齐的出处行。引用后面可以再加一行 `{cite="…"}`，记录出处网址。

> 知之为知之，不知为不知，是知也。
>
> ——《论语·为政》
{cite="https://ctext.org/analects/wei-zheng/zhs"}

```markdown
> 知之为知之，不知为不知，是知也。
>
> ——《论语·为政》
{cite="https://ctext.org/analects/wei-zheng/zhs"}
```

## 任务列表 {#task-lists}

以 `[ ]` 或 `[x]` 开头的列表项会变成清单。读者不能勾选。

- [x] 安装主题
- [x] 配置站点
- [ ] 写第一篇文章

```markdown
- [x] 安装主题
- [x] 配置站点
- [ ] 写第一篇文章
```

## 表格 {#tables}

宽表格横向滚动，不会把页面撑宽。在表格下一行写 `{#id}` 或 `{.class}`，就会加到表格上。

| 功能 | 需要 JavaScript |
| :--- | ---: |
| 配色方案 | 否 |
| 搜索 | 是 |
{#features}

```markdown
| 功能 | 需要 JavaScript |
| :--- | ---: |
| 配色方案 | 否 |
| 搜索 | 是 |
{#features}
```

## 脚注 {#footnotes}

把鼠标移到脚注编号上，或用键盘聚焦它，就能就地预览脚注。[^preview] 在触屏上，点按会跳到页面末尾的脚注。

[^preview]: 脚注内容，同时列在页面末尾。

```markdown
把鼠标移到脚注编号上，就能就地预览脚注。[^preview]

[^preview]: 脚注内容，同时列在页面末尾。
```

## 块属性 {#block-attributes}

紧跟在一个块后面的 `{…}` 行会给这个块加上属性。Icy 为段落提供四个对齐类：`align-left`、`align-center`、`align-right` 和 `align-justify`。

这一段居中。
{.align-center}

```markdown
这一段居中。
{.align-center}
```

块属性需要 [快速开始](/docs/installation/#configure) 里的 Markdown 设置。

## 高亮 {#highlight}

标记的文字会有一笔手绘荧光笔的效果。

只有 <mark>这一部分</mark> 要紧。

```markdown
只有 <mark>这一部分</mark> 要紧。
```

有两种写法：

- 原始 HTML `<mark>`，需要 `markup.goldmark.renderer.unsafe = true`。
- `==文字==`，需要开启 Hugo 的 `markup.goldmark.extensions.extras.mark`。

## 代码块 {#code}

围栏代码块带有随配色方案切换的语法高亮、显示语言或文件名的标题栏，以及复制按钮。

```go {title="main.go" linenos=true hl_lines=[6]}
package main

import "fmt"

func main() {
	fmt.Println("你好，Icy")
}
```

````markdown
```go {title="main.go" linenos=true hl_lines=[6]}
package main

import "fmt"

func main() {
	fmt.Println("你好，Icy")
}
```
````

选项写在语言后面的花括号里：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `title` 或 `filename` | — | 在标题栏中代替语言名显示。 |
| `linenos` | `false` | `true` 显示行号。复制时不带行号。 |
| `linenostart` | `1` | 起始行号。 |
| `hl_lines` | — | 要高亮的行，如 `[2]` 或 `["2-4", 7]`。 |

纯文本代码块不显示标签。Icy 用自己的样式表给代码上色，所以 `markup.highlight.style` 不起作用。

## code-toggle {#code-toggle}

配置示例只用 TOML 写一次，读者就能看到 TOML 和 YAML 两个标签页。它取代 Hugo 内置的 `code-toggle`。

{{< code-toggle file="hugo" >}}
[params.style]
  accent = '#b75133'   # 唯一可配置的颜色
{{< /code-toggle >}}

```markdown
{{</* code-toggle file="hugo" */>}}
[params.style]
  accent = '#b75133'   # 唯一可配置的颜色
{{</* /code-toggle */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `file` | — | 不带扩展名的文件名：`hugo` 显示为 `hugo.toml` 和 `hugo.yaml`。 |
| `fm` | `false` | `true` 表示内容是 front matter，此时 `file` 写内容文件名，如 `content/about`。 |
| `copy` | — | 会被忽略。每个代码块本来就有复制按钮。 |

YAML 标签页里的键会排序，注释会丢掉，所以说明请写在代码块前后。不合法的 TOML 会让构建失败。

## 图表 {#diagrams}

语言为 `pele` 的围栏代码块会渲染成图表。用 [Mermaid](https://mermaid.js.org/) 语法书写，由 [Pele](https://pele.run/) 渲染。

```pele
flowchart LR
  accTitle: 发布一篇文章
  accDescr: 写作、构建、加密，然后部署。
  write["写作"] --> build["hugo --minify"] --> seal["seal + verify"] --> deploy["部署"]
```

````markdown
```pele
flowchart LR
  accTitle: 发布一篇文章
  accDescr: 写作、构建、加密，然后部署。
  write["写作"] --> build["hugo --minify"] --> seal["seal + verify"] --> deploy["部署"]
```
````

- 渲染器 gzip 后约 250 KB，只在图表快要进入屏幕时才加载。
- 读者可以放大缩小，配色随配色方案切换。
- 没有 JavaScript 或语法有误时，以代码形式显示源码。
- `accTitle` 和 `accDescr` 为图表提供无障碍名称和描述。
- 图表里的链接和图片被禁用。`mermaid` 代码块仍是普通代码。

更多图表类型见 [代码与图表](/posts/code-and-diagrams/)。

## 折叠块 {#details}

不用 JavaScript 就能展开收起的折叠块，浏览器的页内查找也能打开它。`name` 相同的几个块组成手风琴：展开一个，其余收起。它取代 Hugo 内置的 `details`。

{{< details summary="Icy 需要 JavaScript 吗？" name="faq" >}}
不需要。每个页面没有脚本都能用，脚本只是 **锦上添花**。
{{< /details >}}
{{< details summary="里面能写 Markdown 吗？" name="faq" >}}
能，正文和 `summary` 里的行内格式都可以。
{{< /details >}}

```markdown
{{</* details summary="Icy 需要 JavaScript 吗？" name="faq" */>}}
不需要。每个页面没有脚本都能用，脚本只是 **锦上添花**。
{{</* /details */>}}
{{</* details summary="里面能写 Markdown 吗？" name="faq" */>}}
能，正文和 `summary` 里的行内格式都可以。
{{</* /details */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `summary` | 必填 | 始终可见的标签，支持行内 Markdown。 |
| `name` | — | 本页内的手风琴分组。 |
| `open` | `false` | 初始展开。 |
| `class` | — | 加在 `<details>` 元素上的额外 class。 |

## 标签页 {#tabs}

分成几个标签的面板。没有 JavaScript 时，所有面板依次显示，各带标题。页内查找会自动切换到匹配的标签。

{{< tabs label="安装 Hugo" >}}
{{< tab title="macOS" >}}
```sh
brew install hugo
```
{{< /tab >}}
{{< tab title="Windows" >}}
```sh
winget install Hugo.Hugo.Extended
```
{{< /tab >}}
{{< /tabs >}}

````markdown
{{</* tabs label="安装 Hugo" */>}}
{{</* tab title="macOS" */>}}
```sh
brew install hugo
```
{{</* /tab */>}}
{{</* tab title="Windows" */>}}
```sh
winget install Hugo.Hugo.Extended
```
{{</* /tab */>}}
{{</* /tabs */>}}
````

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `tabs` 的 `label` | — | 标签列表的无障碍名称。 |
| `tabs` 的 `default` | `1` | 最先显示的标签，从 1 开始数。 |
| `tab` 的 `title` | 必填 | 标签名，支持行内 Markdown。 |

每个 `tab` 都直接放在 `tabs` 里。方向键、{{< kbd "Home" >}} 和 {{< kbd "End" >}} 在标签之间切换。

## 仓库卡片 {#repo}

GitHub、Forgejo 或 Gitea 仓库的卡片：描述、语言、星标、复刻、许可证和最近推送时间，都在构建时获取。

{{< repo url="https://github.com/DejavuMoe/Smoji" >}}

```markdown
{{</* repo url="https://github.com/DejavuMoe/Smoji" */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `url` | 必填 | `https://host/owner/repo`，可以作为唯一的位置参数。 |
| `title` | `owner/name` | 替换显示的名称。 |
| `description` | 来自 API | 替换描述。 |

### 网格 {#repo-grid}

`repo-grid` 把多张卡片排成自适应网格，不接受参数。

{{< repo-grid >}}
{{< repo url="https://github.com/DejavuMoe/edgeTTS" >}}
{{< repo url="https://github.com/DejavuMoe/Ecoku" >}}
{{< repo url="https://github.com/DejavuMoe/PicForge" >}}
{{< repo "https://github.com/DejavuMoe/sani" >}}
{{< /repo-grid >}}

```markdown
{{</* repo-grid */>}}
{{</* repo url="https://github.com/DejavuMoe/edgeTTS" */>}}
{{</* repo url="https://github.com/DejavuMoe/Ecoku" */>}}
{{</* repo url="https://github.com/DejavuMoe/PicForge" */>}}
{{</* repo "https://github.com/DejavuMoe/sani" */>}}
{{</* /repo-grid */>}}
```

### 数据获取 {#repo-fetch}

GitHub 仓库从 `api.github.com` 读取。其他主机一律按 Forgejo 或 Gitea 处理，请求 `/api/v1/repos/<owner>/<repo>`。

{{< code-toggle file="hugo" >}}
[params.repo]
  userAgent = 'hugo-theme-icy'
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `params.repo.userAgent` | `hugo-theme-icy` | 每次请求发送的 `User-Agent`。 |

- 响应保存在 Hugo 的文件缓存里。要让星标和日期保持更新，请让缓存过期，见 [缓存](/docs/deployment/#caches)。
- GitHub 每小时只允许 60 次匿名请求。要提高上限，请给构建提供令牌，见 [GitHub 令牌](/docs/deployment/#github-token)。
- 请求失败时，构建输出 `icy-remote-fetch` 警告，卡片只显示所有者、仓库名和链接，见 [网络访问](/docs/deployment/#network)。
- 不存在的仓库也显示这样的简单卡片，但没有警告，所以请检查网址。

## 键盘按键 {#kbd}

按键和快捷键，按键之间用 `+` 分隔。

按 {{< kbd "Ctrl+Shift+P" >}} 或 {{< kbd keys="⌘+K" >}}。

```markdown
按 {{</* kbd "Ctrl+Shift+P" */>}} 或 {{</* kbd keys="⌘+K" */>}}。
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `keys` | 必填 | 按键，可以作为唯一的位置参数。加号键本身写成 `Plus`。 |

## 注音 {#ruby}

文字上方的注音，例如拼音或日文假名。注音按空格分成的音节数与字数相同时，每个字各配一个音节；否则整段注音横跨整段文字。

{{< ruby "汉字" "hàn zì" >}} 和 {{< ruby "東京" "とうきょう" >}}

```markdown
{{</* ruby "汉字" "hàn zì" */>}} 和 {{</* ruby "東京" "とうきょう" */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `text` | 必填 | 基础文字，第一个位置参数。 |
| `reading` | 必填 | 注音，第二个位置参数。 |

不支持 ruby 的浏览器会把注音放在文字后面的括号里。

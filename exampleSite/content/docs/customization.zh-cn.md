+++
title = '自定义'
description = '把 Icy 变成你的样子：颜色、字体、图标、模板和界面文字。'
weight = 90
date = 2026-11-24
images = ['covers/customization.webp']
+++

所有改动都在你自己的站点里完成，不要动主题目录。站点里和主题文件同路径的文件会替换主题的那份，主题本身保持原样，更新起来也省心。

## 强调色 {#accent}

链接、当前页面和强调都用同一个颜色。其余颜色由它推导：深色配色用一个更亮的强调色，灰色也带上它的色相。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `style.accent` | `'#b75133'` | 十六进制颜色，或 `oklch(55% 0.12 250)` 这样的 CSS 颜色函数。其他写法会被忽略并给出警告。 |
| `style.accentDark` | 推导值 | 自己指定深色配色的强调色。 |

{{< code-toggle file="hugo" >}}
[params.style]
  accent = '#2f6f9f'
{{< /code-toggle >}}

选一个在白底上足够深、适合做链接文字的颜色。默认颜色的对比度是 5.0。

## 浅色与深色 {#color-scheme}

网站跟随读者的系统设置。读者可以用页头的切换按钮选另一种配色，Icy 会记住这个选择。没有 JavaScript 时，按钮会隐藏。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `colorScheme.toggle` | `true` | 显示切换按钮。设为 `false` 则完全跟随系统。 |

{{< code-toggle file="hugo" >}}
[params.colorScheme]
  toggle = false
{{< /code-toggle >}}

## 字体 {#fonts}

Icy 默认不加载任何字体，而是按页面语言使用系统字体：

| 页面语言 | 默认的 `sans` 列表 |
| --- | --- |
| 任意 | `system-ui, sans-serif` |
| 中文 | `system-ui, "PingFang SC", "Microsoft YaHei UI", "Noto Sans CJK SC", "Noto Sans SC", sans-serif` |
| 繁体中文 | `system-ui, "PingFang TC", "Microsoft JhengHei UI", "Noto Sans CJK TC", "Noto Sans TC", sans-serif` |
| 日文 | `system-ui, "Hiragino Sans", "Yu Gothic UI", "Noto Sans CJK JP", "Noto Sans JP", sans-serif` |
| 韩文 | `system-ui, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans CJK KR", "Noto Sans KR", sans-serif` |

代码使用 `ui-monospace, "Cascadia Mono", Menlo, Consolas, "Noto Sans Mono", "DejaVu Sans Mono", monospace`。

要换用其他字体，设置 `[params.fonts]`：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `fonts.sans` | 系统字体 | 除代码以外所有文字的 CSS `font-family` 列表，替换所有语言的默认列表。 |
| `fonts.mono` | 系统等宽字体 | 代码和按键的 CSS `font-family` 列表。 |
| `fonts.stylesheets` | 无 | 每个页面都加载的字体 CSS。 |

`stylesheets` 的每一项可以是：

- 绝对 URL，比如 Google Fonts 的链接：Icy 还会对它的主机加上 `preconnect`；
- 以 `/` 开头的路径：站点 `static/` 中的文件；
- 站点 `assets/` 中的路径：正式构建时会加上指纹。

字体列表只能包含字母、数字、空格、引号、逗号、点、连字符和下划线，否则 Icy 会忽略整个列表并给出警告。每个列表都以通用字体族结尾。你的列表会替换默认列表，所以中文、日文或韩文页面要自己写上 CJK 字体。

### Google Fonts {#google-fonts}

复制 [Google Fonts](https://fonts.google.com/) 给出的样式表 URL，再写上字体名：

{{< code-toggle file="hugo" >}}
[params.fonts]
  sans = '"Inter", system-ui, sans-serif'
  mono = '"JetBrains Mono", ui-monospace, monospace'
  stylesheets = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;600&display=swap',
  ]
{{< /code-toggle >}}

### 自托管字体 {#self-hosted-fonts}

中文、日文和韩文字体动辄几 MB。先用 [WebFont Slice](https://webfont.zsh.moe/) 切分：它在浏览器里运行，生成许多小的 WOFF2 文件和一个 `fonts.css`，读者只下载页面用到的那些字符。

把生成的文件放进站点的 `static/`，用以 `/` 开头的路径加载 CSS。字体名用 `fonts.css` 里写的 `font-family`：

{{< code-toggle file="hugo" >}}
[params.fonts]
  sans = '"LXGW WenKai", system-ui, "PingFang SC", "Microsoft YaHei UI", "Noto Sans CJK SC", sans-serif'
  stylesheets = ['/fonts/fonts.css']    # static/fonts/fonts.css
{{< /code-toggle >}}

如果把手写的 `@font-face` 样式表放在 `assets/`，正式构建时它会被改名，所以引用字体文件要用 `/fonts/inter.woff2` 这样以根开头的 URL。

### 按语言设置字体 {#fonts-per-language}

在某种语言下写同样的键，没写的键沿用 `[params.fonts]`：

{{< code-toggle file="hugo" >}}
[params.fonts]
  stylesheets = ['https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap']

[languages.en.params.fonts]
  sans = '"Inter", system-ui, sans-serif'

[languages.zh-cn.params.fonts]
  sans = '"Inter", system-ui, "PingFang SC", "Microsoft YaHei UI", "Noto Sans CJK SC", sans-serif'
{{< /code-toggle >}}

宽得多的字体会让页头需要更多空间。换字体后，在几种窗口宽度下看一看页头。

## 站点图标与字标 {#brand}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `brand.icon` | 主题的图标 | `assets/` 中的正方形 PNG、JPEG 或 WebP，至少 512px。 |
| `brand.iconSVG` | 无 | SVG 格式的 favicon，位于 `assets/` 或 `static/`。 |
| `brand.wordmark` | 无 | `assets/` 中的 SVG，代替站点标题显示在页头。 |
| `brand.themeColor.light` | `'#ffffff'` | 浅色配色下浏览器界面的颜色，比如手机上的地址栏。 |
| `brand.themeColor.dark` | `'#241f1e'` | 深色配色下的同一颜色。 |

{{< code-toggle file="hugo" >}}
[params.brand]
  icon = 'brand/icon.png'             # assets/brand/icon.png
  wordmark = 'brand/wordmark.svg'     # assets/brand/wordmark.svg
  [params.brand.themeColor]
    light = '#ffffff'
    dark = '#241f1e'
{{< /code-toggle >}}

Icy 由 `icon` 生成 favicon、Apple touch icon 和 Web 应用图标。512px 的版本同时用作 RSS 图片和结构化数据中的发布者标志。

字标会内联到页面，高 1.75rem，颜色跟随文字。它需要：

- 根元素 `<svg>` 带有 `viewBox`，否则 Icy 会警告并改为显示标题；
- 用填充的 `<path>` 绘制，文字转换为路径；
- 不依赖自带的颜色：`fill`、`stroke` 和 `style` 属性会被移除。

鼠标悬停时，一道强调色的波浪会按文档顺序扫过各条路径，所以请按标志的阅读顺序排列路径。屏幕阅读器仍会读出站点标题。

## 图标 {#icons}

图标是 `assets/icons/` 中的 SVG 文件，按名字使用。要添加图标或替换主题的图标，把文件放进站点的 `assets/icons/`：

```text
my-blog/
└── assets/
    └── icons/
        ├── mastodon.svg     新图标：name = 'mastodon'
        └── github.svg       替换主题的 github 图标
```

[社交链接](/docs/configuration/#social) 和 [页脚致谢](/docs/configuration/#footer) 的图标由你选择。`search`、`toc`、`copy` 等界面图标来自 [Tabler Icons](https://tabler.io/icons)，只有想换风格时才需要替换。

图标文件必须：

- 以 `<svg` 开头，前面不能有 XML 声明或注释；
- 填充和描边使用 `currentColor`，让图标跟随文字颜色；
- 文件名只用小写字母、数字、`-` 和 `_`。

图标高 1em，宽的标志按 `viewBox` 保持比例。

## 扩展 partial {#extend}

主题里有两个空的 partial，用来往每个页面加你自己的代码：

| 在站点中新建 | 渲染位置 |
| --- | --- |
| `layouts/_partials/extend/head.html` | `<head>` 末尾，在主题的 CSS 和脚本之后。 |
| `layouts/_partials/extend/footer.html` | 紧挨 `</body>` 之前。 |

两者都以当前页面为上下文，`.Params`、`.IsHome` 和 `hugo.IsProduction` 都能用。主题更新不会碰到它们。

### 自己的 CSS {#custom-css}

把规则写在 `assets/css/custom.css`，在 `extend/head.html` 中引用：

```go-html-template
{{- /* layouts/_partials/extend/head.html */ -}}
{{- with resources.Get "css/custom.css" }}
  {{- with . | minify | fingerprint }}
<link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
  {{- end }}
{{- end }}
```

你的规则优先于主题的规则。要做大范围的调整，就设置主题 `assets/css/base/tokens.css` 中列出的自定义属性：

```css
/* assets/css/custom.css */
:root {
  --measure: 40rem;        /* 更窄的阅读栏 */
  --radius-l: 0.25rem;     /* 更方的卡片 */
}

/* 自己的颜色：用 light-dark() 同时写出两种配色。 */
.my-note {
  background: light-dark(#fff8e6, #2b2618);
}
```

### 自己的 JavaScript {#custom-js}

用 Hugo 的 `js.Build` 打包模块，在 `extend/footer.html` 中加载：

```go-html-template
{{- /* layouts/_partials/extend/footer.html */ -}}
{{- with resources.Get "js/site.js" }}
  {{- with . | js.Build (dict "minify" hugo.IsProduction) | fingerprint }}
<script type="module" src="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}"></script>
  {{- end }}
{{- end }}
```

页面加载后才插入的内容，比如解锁后的受保护文章，会在 `document` 上触发 `icy:content` 事件，新元素是 `event.detail.root`：

```js
// assets/js/site.js
function enhance(root) {
  for (const table of root.querySelectorAll("table")) table.dataset.enhanced = "yes";
}

enhance(document);
document.addEventListener("icy:content", (event) => enhance(event.detail.root));
```

## 覆盖模板 {#overrides}

要修改某个模板，把它从主题复制到站点中的相同路径，再改这份副本：

```sh
mkdir -p layouts/_partials
cp themes/hugo-theme-icy/layouts/_partials/footer.html layouts/_partials/footer.html
```

页面布局、partial、短代码和渲染钩子都可以这样覆盖。`assets/css/` 中的样式表也一样，会整个替换主题的文件。副本不再获得主题的修复，所以覆盖要尽量少，更新主题时对照一下主题的版本。

### 其他评论或统计服务 {#other-services}

Icy 内置 Ecoku 评论和 Plausible 统计。要换一个评论系统，覆盖 `layouts/_partials/comments.html`：

```go-html-template
{{- /* layouts/_partials/comments.html */ -}}
{{- if ne .Params.comments false }}
{{- partial "assets/use.html" (dict "page" . "feature" "comments") }}
<section class="comments" id="comments" aria-labelledby="comments-title">
  <h2 class="comments-title" id="comments-title">{{ T "comments" }}</h2>
  <div data-comments-loader="https://comments.example.com/embed.js"></div>
</section>
{{- end }}
```

`assets/use.html` 这一行加载主题的评论样式，以及一个脚本：读者滚动到评论附近时，它才加载 `data-comments-loader` 中的 URL。如果你的系统需要自己的 `<script>` 标签，就把它放进这个 section。

要换一个统计服务，把它的脚本加到 `extend/head.html`，只在正式构建中加载，并遵守 `analytics = false`：

```go-html-template
{{- /* layouts/_partials/extend/head.html */ -}}
{{- if and hugo.IsProduction (ne .Params.analytics false) }}
<script defer src="https://analytics.example.com/script.js" data-website-id="your-site-id"></script>
{{- end }}
```

## 界面文字与日期 {#strings}

所有界面文字都来自主题的 `i18n/` 文件。要修改其中一部分，在站点的 `i18n/` 中新建同名文件，只写要改的键：

```toml
# 站点中的 i18n/zh-cn.toml
recentPosts = "最新文章"
dateLong = "2006 年 1 月 2 日"
```

主题的 `i18n/en.toml` 列出了全部键。要加一种新语言，把它复制到站点的 `i18n/`，以语言键命名，比如 `ja.toml`，再翻译其中的值。缺少的文字会使用默认语言的版本。

日期用三个键：

| 键 | 英文 | 简体中文 | 用于 |
| --- | --- | --- | --- |
| `dateLong` | `:date_long` | `2006年1月2日` | 文章元信息、“更新于”说明和版权卡片。 |
| `dateShort` | `Jan 2` | `01-02` | 首页、按年分组的归档和更新日志。 |
| `dateFull` | `2006-01-02` | `2006-01-02` | 不按年分组的归档。 |

值可以是 Go 的时间布局，用参考日期 `2006-01-02` 来写；也可以是 Hugo 的本地化格式，比如 `:date_long`。

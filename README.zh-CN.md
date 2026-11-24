# Icy

一个安静、快速的 Hugo 个人博客主题，只用原生 HTML、CSS 和 JavaScript。

[English](README.md) · 简体中文

![Icy 截图](images/screenshot.png)

## 功能

- 自选一个强调色，浅色和深色配色跟随系统。
- 为阅读而设计：长文旁的目录、脚注预览、提示框、带复制按钮的代码块、图表。
- 可放大查看的图片、画廊、实况照片、支持歌单的音频播放器、视频、点击才加载的 YouTube 嵌入。
- 密码保护的文章，构建之后加密。
- 站内搜索、按年归档、标签索引、友链和更新日志页面。
- 多语言，自带英文和简体中文。
- SEO、RSS、Ecoku 评论和 Plausible 统计。
- 不用框架，不用 npm。每个页面不开 JavaScript 也能用，并且只加载用到的资源。

## 快速开始

需要 Hugo 0.158.0 或更新版本（标准版即可）和 Git。

```sh
git submodule add https://github.com/DejavuMoe/hugo-theme-icy.git themes/hugo-theme-icy
```

然后在 `hugo.toml` 里设置主题和它需要的 Markdown 选项：

```toml
theme = 'hugo-theme-icy'

[markup.goldmark.parser]
  wrapStandAloneImageWithinParagraph = false
  [markup.goldmark.parser.attribute]
    block = true
```

启动预览，打开 <http://localhost:1313/>：

```sh
hugo server
```

## 文档

其余内容都在文档里：**<https://icy.zsh.moe/zh-cn/docs/>**。[演示站点](https://icy.zsh.moe/zh-cn/) 展示了每项功能的实际效果。

## 许可

[MIT](LICENSE) © 2026 Dejavu Moe。

随附的第三方组件：

- Tabler Icons — MIT — [许可证](assets/icons/tabler.LICENSE)
- Pele，含一个 Lucide 图标 — MIT 与 ISC — [许可证](assets/js/vendor/pele.LICENSE)

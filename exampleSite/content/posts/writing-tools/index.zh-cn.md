+++
title = '写作工具'
date = 2026-11-17T10:00:00+08:00
images = ['covers/writing-tools.webp']
description = '折叠块、标签页、仓库卡片、键盘按键和注音在文章里的样子。'
tags = ['短代码', '排版']
categories = ['示例']
+++

这些写法见 [写作](/docs/writing/) 文档。

搭这个博客时记的一些笔记，顺便用上几个让笔记更整齐的小工具。

## 安装主题

把 Icy 加进站点有三种方式，选一种就好：

{{< tabs label="安装主题" >}}
{{< tab title="Hugo Module" >}}
```toml {title="hugo.toml"}
[module]
  [[module.imports]]
    path = "github.com/DejavuMoe/hugo-theme-icy"
```
{{< /tab >}}
{{< tab title="Git 子模块" >}}
```sh
git submodule add https://github.com/DejavuMoe/hugo-theme-icy themes/hugo-theme-icy
```
{{< /tab >}}
{{< tab title="直接下载" >}}
从 GitHub 下载压缩包，解压到 `themes/hugo-theme-icy`。
{{< /tab >}}
{{< /tabs >}}

然后给整个站点定一个颜色：

{{< code-toggle file="hugo" >}}
[params.style]
  accent = '#b75133'
{{< /code-toggle >}}

每篇新文章都这样开头：

{{< code-toggle fm=true >}}
title = '你好'
tags = ['Markdown']
{{< /code-toggle >}}

## 发布之前

{{< details summary="发布前检查" open=true >}}
1. 用 `--panicOnWarning` 构建。
2. 加密并校验受保护的文章。
3. 部署 `public/` 目录。
{{< /details >}}

## 朋友们问过的问题

{{< details summary="Icy 需要 Node.js 吗？" name="faq" >}}
不需要，所有东西都由 Hugo 构建。只有受保护文章的可选脚本才用到 Node.js。
{{< /details >}}

{{< details summary="不开 JavaScript 能用吗？" name="faq" >}}
能。每个页面都可以正常阅读和跳转。JavaScript 只负责图片查看器、播放器控件、复制按钮和脚注预览。
{{< /details >}}

{{< details summary="可以换颜色吗？" name="faq" >}}
可以，改一个设置就行。深色模式和带暖调的灰色都会跟着变。
{{< /details >}}

## 作者的其他项目

星标最多的一个：

{{< repo url="https://github.com/DejavuMoe/Smoji" >}}

其余的按星标数排列：

{{< repo-grid >}}
{{< repo url="https://github.com/DejavuMoe/edgeTTS" >}}
{{< repo url="https://github.com/DejavuMoe/Ecoku" >}}
{{< repo url="https://github.com/DejavuMoe/PicForge" >}}
{{< repo url="https://github.com/DejavuMoe/sani" >}}
{{< repo url="https://github.com/DejavuMoe/prototype-first-ui" >}}
{{< repo url="https://github.com/DejavuMoe/webfont-slice" >}}
{{< repo url="https://github.com/DejavuMoe/general-project-audit-and-optimization" description="审计现有项目、挑选要做的修复，再逐项验证的 Agent Skill。" >}}
{{< repo url="https://github.com/DejavuMoe/STranslate.Plugin.Tts.edgeTTS" >}}
{{< repo url="https://github.com/DejavuMoe/PicBerth" description="自托管的个人图床：一个可执行文件加一个数据目录。" >}}
{{< /repo-grid >}}

## 每天都用的快捷键

{{< kbd "Ctrl+S" >}} 保存，{{< kbd "Ctrl+Shift+P" >}} 打开命令面板，在 Mac 上按 {{< kbd keys="⌘+Option+I" >}} 打开开发者工具，{{< kbd "Esc" >}} 几乎能退出一切。

## 名字和读音

这个主题读作 {{< ruby "Icy" "/ˈaɪsi/" >}}。中文可以标拼音：{{< ruby "汉字" "hàn zì" >}}，也可以逐字标注：{{< ruby "北" "běi" >}}{{< ruby "京" "jīng" >}}。日文可以标假名：{{< ruby text="漢字" reading="かんじ" >}}。

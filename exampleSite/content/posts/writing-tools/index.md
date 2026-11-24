+++
title = 'Writing tools'
date = 2026-11-17T10:00:00+08:00
images = ['covers/writing-tools.webp']
description = 'Collapsible notes, tabs, repository cards, keyboard keys and ruby annotations in a real post.'
tags = ['Shortcodes', 'Typography']
categories = ['Examples']
+++

How to write these: [Writing](/docs/writing/).

Notes from setting up this blog, and the small tools that keep them tidy.

## Installing the theme

There are three ways to add Icy to a site. Pick one:

{{< tabs label="Install the theme" >}}
{{< tab title="Hugo Module" >}}
```toml {title="hugo.toml"}
[module]
  [[module.imports]]
    path = "github.com/DejavuMoe/hugo-theme-icy"
```
{{< /tab >}}
{{< tab title="Git submodule" >}}
```sh
git submodule add https://github.com/DejavuMoe/hugo-theme-icy themes/hugo-theme-icy
```
{{< /tab >}}
{{< tab title="Download" >}}
Download the archive from GitHub and extract it to `themes/hugo-theme-icy`.
{{< /tab >}}
{{< /tabs >}}

Then one color for the whole site:

{{< code-toggle file="hugo" >}}
[params.style]
  accent = '#b75133'
{{< /code-toggle >}}

And every new post starts like this:

{{< code-toggle fm=true >}}
title = 'Hello'
tags = ['Markdown']
{{< /code-toggle >}}

## Before publishing

{{< details summary="Release checklist" open=true >}}
1. Build with `--panicOnWarning`.
2. Seal and verify the protected posts.
3. Deploy the `public/` directory.
{{< /details >}}

## Questions friends asked

{{< details summary="Does Icy need Node.js?" name="faq" >}}
No. Hugo builds everything. Node.js is only used by the optional scripts for protected posts.
{{< /details >}}
{{< details summary="Does it work without JavaScript?" name="faq" >}}
Yes. Every page reads and navigates without script. JavaScript adds the image viewer, player controls, copy buttons and footnote previews.
{{< /details >}}
{{< details summary="Can I change the color?" name="faq" >}}
Yes, one setting. The dark scheme and the tinted greys follow it.
{{< /details >}}

## Projects behind it

{{< repo url="https://github.com/gohugoio/hugo" >}}

And a few more it relies on:

{{< repo-grid >}}
{{< repo url="https://github.com/yuin/goldmark" title="Goldmark" description="The Markdown parser inside Hugo." >}}
{{< repo url="https://github.com/alecthomas/chroma" >}}
{{< repo url="https://github.com/gohugoio/hugoDocs" >}}
{{< repo url="https://codeberg.org/forgejo/forgejo" >}}
{{< /repo-grid >}}

## Shortcuts I use every day

{{< kbd "Ctrl+S" >}} to save, {{< kbd "Ctrl+Shift+P" >}} for the command palette, {{< kbd keys="⌘+Option+I" >}} for the developer tools on a Mac, and {{< kbd "Esc" >}} to get out of almost anything.

## Names and readings

The theme's name is read {{< ruby "Icy" "/ˈaɪsi/" >}}. Chinese gets pinyin, {{< ruby "汉字" "hàn zì" >}}, or one reading per character, {{< ruby "北" "běi" >}}{{< ruby "京" "jīng" >}}. Japanese gets furigana: {{< ruby text="漢字" reading="かんじ" >}}.

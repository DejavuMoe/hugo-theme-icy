+++
title = 'Getting started'
description = 'Install Icy, configure it and publish your first post.'
weight = 10
date = 2026-11-24
images = ['covers/installation.webp']
+++

## Requirements {#requirements}

- [Hugo](https://gohugo.io/installation/) 0.158.0 or later. The standard edition is enough.
- Git, to add the theme.
- Node.js, only if you publish [protected posts](/docs/protected-posts/).

## Install {#install}

Create a site if you don't have one yet, and run every later command inside it:

```sh
hugo new project my-blog
cd my-blog
git init
```

Then add the theme:

{{< tabs label="Add the theme" >}}
{{< tab title="Git submodule" >}}
The recommended way:

```sh
git submodule add https://github.com/DejavuMoe/hugo-theme-icy.git themes/hugo-theme-icy
```

To clone your site later with the theme, use `git clone --recurse-submodules`.
{{< /tab >}}
{{< tab title="Hugo Module" >}}
Needs [Go](https://go.dev/dl/). Turn your site into a module once:

```sh
hugo mod init github.com/you/my-blog
```

In the configuration below, replace `theme = 'hugo-theme-icy'` with:

```toml
[module]
  [[module.imports]]
    path = 'github.com/DejavuMoe/hugo-theme-icy'
```

The theme then lives in Hugo's module cache. Commands in these docs that start with `node themes/hugo-theme-icy/` need that path instead.
{{< /tab >}}
{{< tab title="ZIP" >}}
Download the [repository as a ZIP](https://github.com/DejavuMoe/hugo-theme-icy/archive/refs/heads/master.zip), extract it, and rename the folder to `themes/hugo-theme-icy` inside your site.
{{< /tab >}}
{{< /tabs >}}

## Configure {#configure}

Replace the contents of `hugo.toml` with this, then change the values to your own:

{{< code-toggle file="hugo" >}}
baseURL = 'https://example.com/'
title = 'My Blog'
theme = 'hugo-theme-icy'
mainSections = ['posts']

[markup.goldmark.parser]
  wrapStandAloneImageWithinParagraph = false
  [markup.goldmark.parser.attribute]
    block = true

[[menus.main]]
  name = 'Posts'
  pageRef = '/posts'
  weight = 10

[params]
  description = 'Notes on whatever I am learning.'
  [params.author]
    name = 'Your Name'
    bio = 'One line about you.'
{{< /code-toggle >}}

Hugo ignores a theme's `[markup]` settings, so these two must be in your own configuration:

| Setting | What it does |
| --- | --- |
| `wrapStandAloneImageWithinParagraph = false` | An image on its own line becomes a figure. Without it, images render small and inline. |
| `attribute.block = true` | Lets you add attributes such as `{.align-center}` on the line after a paragraph, image or table. |

Writing in Chinese, Japanese or Korean? Also add [these Hugo settings](/docs/configuration/#hugo-settings). Every other setting is in [Configuration](/docs/configuration/).

## Write your first post {#first-post}

```sh
hugo new posts/hello-world.md
```

This creates `content/posts/hello-world.md` from the theme's post template. The commented lines in its front matter list the optional keys. Write the post below the front matter:

```markdown
+++
title = 'Hello World'
date = 2026-11-24T10:00:00+08:00
draft = true
summary = ''
tags = ['Notes']
+++

My first post with **Icy**.
```

New posts are drafts. Set `draft = false` to publish one. For a post with its own images, create a folder instead: `hugo new posts/hello-world/index.md`, and put the images next to `index.md`. See [Media](/docs/media/#sources).

## Preview {#preview}

```sh
hugo server -D
```

Open <http://localhost:1313/>. The page reloads when you save, and `-D` includes drafts.

## Build {#build}

```sh
hugo --gc --minify
```

The finished site is in `public/`. To publish it, see [Deployment](/docs/deployment/).

## Update {#update}

Read the [changelog](/changelog/) first, then:

{{< tabs label="Update the theme" >}}
{{< tab title="Git submodule" >}}
```sh
git submodule update --remote themes/hugo-theme-icy
```
{{< /tab >}}
{{< tab title="Hugo Module" >}}
```sh
hugo mod get -u github.com/DejavuMoe/hugo-theme-icy
hugo mod tidy
```
{{< /tab >}}
{{< tab title="ZIP" >}}
Replace the `themes/hugo-theme-icy` folder with a fresh copy.
{{< /tab >}}
{{< /tabs >}}

An update never touches your own `assets/`, `layouts/` and `i18n/`. If you copied theme templates into `layouts/`, compare them with the new versions.

## Ask an AI {#ai}

All of these docs are in one file for AI assistants: <https://icy.zsh.moe/llms-full.txt>. The Chinese version is <https://icy.zsh.moe/zh-cn/llms-full.txt>. Give the link to an assistant with a prompt like these:

```text
Read https://icy.zsh.moe/llms-full.txt
and help me create a Hugo site with
the Icy theme. Write a hugo.toml with
my name, a GitHub link and search.
```

```text
Read https://icy.zsh.moe/llms-full.txt
Here is my hugo.toml: [paste it]
What is wrong or missing?
```

```text
Read https://icy.zsh.moe/llms-full.txt
I want to [use my own font]. Which
files do I add to my site, and what
goes in them? Don't edit the theme.
```

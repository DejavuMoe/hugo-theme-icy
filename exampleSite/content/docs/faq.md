+++
title = 'FAQ'
description = 'Fixes for the problems people run into most.'
weight = 110
date = 2026-11-24
images = ['covers/faq.webp']
+++

## Images render tiny, in the middle of a line {#tiny-images}

Your `hugo.toml` is missing `wrapStandAloneImageWithinParagraph = false`. Hugo ignores a theme's `[markup]` settings, so you have to add it yourself. See [Getting started](/docs/installation/#configure).

## The home page lists the wrong pages {#wrong-home-pages}

Set `mainSections` to the section that holds your posts. Without it, Hugo picks the section with the most pages. See [Pages](/docs/pages/#main-sections).

## The build fails with an error about a parameter {#parameter-error}

Read the message: it names the setting or shortcode, and usually the file and line. Most often it is a misspelled shortcode parameter or a path that does not exist. See [Configuration](/docs/configuration/#errors).

## A setting has no effect {#setting-ignored}

Hugo silently ignores site parameters it doesn't know, so check the spelling. In TOML, also check where the key sits: every key below a header such as `[params.author]` belongs to that table, so top-level keys like `mainSections` go before the first header.

## An alert loses its custom title {#alert-title}

On a site with CJK line breaks on, Hugo joins the title line and the next line, so the alert shows everything as text under the default title. Put an empty `>` line after the title:

```markdown
> [!WARNING] 先备份
>
> 正文从这里开始。
```

See [Writing](/docs/writing/#alerts).

## `--panicOnWarning` fails because of protected posts {#protected-warning}

A production build warns about every protected post until its output is sealed. If every build you deploy runs the seal and verify scripts, silence the warning with `ignoreLogs`. See [Protected posts](/docs/protected-posts/#warning).

## The build fails without network access {#offline-build}

Repository cards, YouTube thumbnails and remote images are downloaded at build time. When a download fails, the page falls back and Hugo logs the warning `icy-remote-fetch`, which `--panicOnWarning` turns into an error. If your CI may run offline, list that id in `ignoreLogs`. See [Deployment](/docs/deployment/#network).

## How do I update the theme? {#update}

Read the changelog, then pull the new version the same way you installed it. See [Getting started](/docs/installation/#update).

## The menu links are missing on phones {#phone-header}

When the links don't fit beside the site name, the header keeps only search and a menu button. The button opens the links in a full-screen panel, with the language and color-scheme choices at its bottom. See [Configuration](/docs/configuration/#menus).

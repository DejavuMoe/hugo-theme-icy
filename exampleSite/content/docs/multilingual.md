+++
title = 'Multilingual'
description = 'Run your site in more than one language.'
weight = 80
date = 2026-11-24
images = ['covers/multilingual.webp']
+++

Each language is a separate Hugo site with its own menus, parameters, feeds and search index. Icy adds a language switch to the header and the alternate links search engines need. This site is bilingual: try the 中 / EN switch in the header.

## Languages {#languages}

Declare each language under `[languages]`. The top-level `[params]` is shared. Put what differs into the language's own `params` and `menus`:

{{< code-toggle file="hugo" >}}
defaultContentLanguage = 'en'
hasCJKLanguage = true

[languages]
  [languages.en]
    locale = 'en'
    label = 'English'
    weight = 1
    [languages.en.params]
      description = 'Notes on whatever I am learning.'

  [languages.zh-cn]
    locale = 'zh-CN'
    label = '简体中文'
    weight = 2
    [languages.zh-cn.params]
      description = '学习笔记。'
      languageShort = '中'
      [languages.zh-cn.params.author]
        bio = '一句话介绍。'

[languages.en.menus]
  [[languages.en.menus.main]]
    name = 'Posts'
    pageRef = '/posts'
    weight = 10

[languages.zh-cn.menus]
  [[languages.zh-cn.menus.main]]
    name = '文章'
    pageRef = '/posts'
    weight = 10
{{< /code-toggle >}}

| Key | Description |
| --- | --- |
| `locale` | The page's `lang`, which also picks the default fonts. Also used for `hreflang`, `og:locale` and the RSS language. Defaults to the language key. |
| `label` | The language's name in the switch, for screen readers and as a tooltip. |
| `direction` | `ltr` or `rtl`. |
| `params` | Overrides the top-level `[params]` key by key. A language that sets only `fonts.sans` still gets `fonts.stylesheets` from the top level. |
| `menus` | The language's header and footer menus. `pageRef` resolves to the page in that language. |

## Translations {#translations}

Name a translation after the default-language file, with the language key before the extension:

```text
content/
├── about.md                 English
├── about.zh-cn.md           Simplified Chinese
└── posts/
    └── hello/
        ├── index.md         English
        ├── index.zh-cn.md   Simplified Chinese
        └── photo.jpg        shared by both
```

Files with the same path are translations of each other. To pair files with different names, give them the same `translationKey`. A page does not need a translation in every language.

> [!WARNING]
> A page bundle shares its images between translations only when it has an `index.md` in the default language. A bundle with only `index.zh-cn.md` cannot find its images, and the build fails. Add a default-language `index.md`, or write the post as a single file with its images in `assets/` or `static/`.

## Language switch {#language-switch}

The header shows a short code for each other language. It links to the translation of the current page, or to that language's home page when there is none.

| Parameter | Default | Description |
| --- | --- | --- |
| `languageShort` | first two letters of the language key, upper case | The language's code in the switch. Set it per language. |

{{< code-toggle file="hugo" >}}
[languages.zh-cn.params]
  languageShort = '中'
{{< /code-toggle >}}

The switch takes room in the header, so with several languages the links move into the menu button sooner.

## What each language gets {#per-language}

| Feature | Behavior |
| --- | --- |
| Alternate links | Every page links its translations with `hreflang`. |
| Search | One index per language. Add a search page in every language, such as `search.md` and `search.zh-cn.md`. |
| RSS | One set of feeds per language: `/index.xml`, `/zh-cn/index.xml` … |
| Sitemap | One per language, listed in the sitemap index at `/sitemap.xml`. |
| Tags | Per language. See [Tags](/docs/pages/#tags). |
| Fonts | The defaults follow the page language. See [Fonts per language](/docs/customization/#fonts-per-language). |
| Interface text | From the i18n file of the language. See [Interface strings](/docs/customization/#strings). |

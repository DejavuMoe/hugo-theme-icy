+++
title = 'Pages'
description = 'Set up the home page, archives, tags, search, friends, changelog and other pages.'
weight = 50
date = 2026-11-24
images = ['covers/pages.webp']
+++

## Main sections {#main-sections}

Icy treats the pages in Hugo's `mainSections` as blog posts. They fill the home page and the home feed, and get a year archive, a copyright card and the Open Graph `article` type. Hugo guesses the setting from the largest section, so set it explicitly:

{{< code-toggle file="hugo" >}}
mainSections = ['posts']
{{< /code-toggle >}}

## Home page {#home}

The home page shows, from top to bottom:

1. An author intro: avatar, name, bio and social links, set up in [Configuration](/docs/configuration/#author).
2. The body of `content/_index.md`, if it has one.
3. Recent posts from the main sections, one line each. An "All posts" link appears when the list is cut short.

{{< code-toggle file="hugo" >}}
[params.home]
  intro = true
  recentCount = 8
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `intro` | `true` | `false` hides the author intro. |
| `title` | `params.author.name` | Heading of the intro. |
| `bio` | `params.author.bio` | Text of the intro, Markdown. |
| `recentCount` | `8` | Number of recent posts. `0` lists all of them. |

To keep a post off the home page but in the archive, set `hiddenInHomeList = true` in its front matter.

## Archives and section lists {#lists}

A main section, and every tag or category page, is an archive grouped by year. The subtitle shows the post count, or the section's `description` if it has one. Drafts and protected posts carry a small label.

| Parameter | Default | Description |
| --- | --- | --- |
| `params.list.groupByYear` | `true` | `false` lists all posts in one list with full dates. |
| `params.list.paginate` | `false` | `true` splits the archive into pages of `pagination.pagerSize` posts. |

Any other section, such as these docs, lists its pages by `weight`, each with its description. In both cases the body of the section's `_index.md` appears above the list.

## Tags {#tags}

The tag index at `/tags/` looks like the index at the back of a book. Tags are grouped by initial: digits, then A–Z, then "#" for everything else. Each row shows the name and the number of posts.

Protected posts are not counted, and a tag used only by protected posts is hidden. Categories and any other taxonomy use the same layout. To set the index's title, description or intro text, create `content/tags/_index.md`.

### Chinese tag names {#chinese-tag-names}

On a Simplified Chinese site, a tag that starts with a Chinese character is filed under its pinyin initial. "图片" (tú) goes under T, next to "Typography". On other sites, non-Latin names go under "#".

The initial comes from the first character, so a character with several readings can land in the wrong group. To fix it, set `initial` on the tag's term page:

{{< code-toggle file="content/tags/重庆/_index" fm=true >}}
title = '重庆'
initial = 'C'
{{< /code-toggle >}}

`initial` is one letter or digit. On a multilingual site, put it in that language's term page, such as `content/tags/重庆/_index.zh-cn.md`.

## Search {#search}

Search runs in the browser against an index built with the site. Try it on this site's [search page](/search/). Create the page:

{{< code-toggle file="content/search" fm=true >}}
title = 'Search'
layout = 'search'
searchHidden = true
toc = false
placeholder = 'Search titles, tags and text'
{{< /code-toggle >}}

Once the page exists, a search icon appears in the header. `placeholder` is optional, and the page body is shown under the title.

| Parameter | Default | Description |
| --- | --- | --- |
| `params.search.page` | `/search` | Page the header icon links to. |
| `params.search.maxResults` | `20` | Maximum number of results. |
| `params.search.contentLimit` | `20000` | Characters of body text indexed per page. |

- Every word you type must match. Case is ignored, and words match inside longer words, so Chinese and Japanese need no word splitting.
- Title matches rank first, then tags, the summary and the body.
- The query stays in the address, as in `/search/?q=hugo`, so results can be linked.
- Every regular page is indexed. Leave one out with `searchHidden = true`. Protected posts are never indexed.
- Each language has its own index. Search needs JavaScript.

## Friends {#friends}

A page of links to other sites, read from `data/friends.yaml`. This site's [Who uses Icy](/friends/) is one. Create a page with the `friends` layout:

{{< code-toggle file="content/friends/_index" fm=true >}}
title = 'Friends'
description = 'Sites I read.'
layout = 'friends'
{{< /code-toggle >}}

The page body appears above the list. List the sites in the data file:

```yaml {title="data/friends.yaml"}
- name: Hugo
  url: https://gohugo.io/
  avatar: https://github.com/gohugoio.png
  description: The world's fastest framework for building websites.
- name: A friend
  url: https://example.com/
  avatar: friends/alex.png       # assets/friends/alex.png
  description:
    en: Notes on gardening and code.
    zh-cn: 关于园艺和代码的笔记。
```

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Site or person name. |
| `url` | Yes | An `http` or `https` link. |
| `avatar` | No | Image path or URL, like any [media path](/docs/media/#sources). |
| `description` | No | Shown when the pointer rests on the card; touch screens leave it out. A string, or one text per language code. |

- Avatars are cropped to 96px. Remote avatars are downloaded at build time, so readers never contact the original host.
- Without an avatar, or when the download fails, the entry shows the first letter of the name.
- A missing `name` or `url`, or a URL that is not `http(s)`, fails the build.
- Set `params.friends.ref` to add a `ref` query parameter to every link, such as `?ref=https://example.com`. Leave it empty to keep the links as they are. A link that already has a `ref` keeps its own.
- If the page is a section, its child pages are listed below the friends.

## Changelog {#changelog}

A dated list of changes, kept in the page's front matter. This site's [changelog](/changelog/) is one.

{{< code-toggle file="content/changelog" fm=true >}}
title = 'Changelog'
layout = 'changelog'
searchHidden = true

[[changes]]
date = 2026-11-23
title = 'Switched to the Icy theme'
summary = 'Assets now load **per feature**.'

[[changes]]
date = 2026-08-14
title = 'Self-hosted comments'
{{< /code-toggle >}}

Each entry needs a `date` and a `title`, or the build fails. `summary` is optional, and both accept inline Markdown. Entries are grouped by year, newest first, below the page body.

## About and other single pages {#about}

A page such as `content/about.md` is an ordinary page outside the main sections. It gets no copyright card and stays off the home page and the home feed. These front matter keys suit such pages:

{{< code-toggle file="content/about" fm=true >}}
title = 'About'
toc = false
hideMeta = true
comments = false
schemaType = 'AboutPage'
{{< /code-toggle >}}

All page keys are listed in [Configuration](/docs/configuration/#front-matter).

## 404 page {#not-found}

Hugo writes `404.html` at the site root, and under each language's prefix on a multilingual site. It shows a short message and a link home. Your web server must serve it for missing paths: see [Deployment](/docs/deployment/#headers).

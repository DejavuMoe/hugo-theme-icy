+++
title = 'Add your site'
description = 'How to get your Icy site listed here.'
weight = 10
+++

Built a site with Icy? Add it to the list:

1. Fork [DejavuMoe/hugo-theme-icy](https://github.com/DejavuMoe/hugo-theme-icy) on GitHub.
2. Add an entry at the end of `exampleSite/data/friends.yaml`.
3. If you have a square avatar, add it to `exampleSite/assets/friends/`.
4. Open a pull request.

```yaml {title="exampleSite/data/friends.yaml"}
- name: Your site
  url: https://example.com/
  avatar: friends/your-site.webp
  description:
    en: One line about your site.
    zh-cn: 一句话介绍你的站点。
```

Only `name` and `url` are required. The other fields are described in [Friends](/docs/pages/#friends).

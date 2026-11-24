+++
title = '添加你的站点'
description = '怎样把你的 Icy 站点加进这个列表。'
weight = 10
+++

用 Icy 搭了站？把它加进列表：

1. 在 GitHub 上 fork [DejavuMoe/hugo-theme-icy](https://github.com/DejavuMoe/hugo-theme-icy)。
2. 在 `exampleSite/data/friends.yaml` 末尾加一个条目。
3. 如果有方形头像，放到 `exampleSite/assets/friends/`。
4. 提交 pull request。

```yaml {title="exampleSite/data/friends.yaml"}
- name: Your site
  url: https://example.com/
  avatar: friends/your-site.webp
  description:
    en: One line about your site.
    zh-cn: 一句话介绍你的站点。
```

只有 `name` 和 `url` 是必填的，其他字段的说明见 [友链](/docs/pages/#friends)。

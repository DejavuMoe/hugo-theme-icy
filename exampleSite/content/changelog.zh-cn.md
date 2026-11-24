+++
title = '更新日志'
description = 'Icy 主题的重要版本。'
layout = 'changelog'
searchHidden = true
changes = [
  { date = 2026-11-24, title = '首次公开发布', summary = 'Icy 1.0 发布，这个双语站点就是它的 [文档](/docs/)。字体可按语言设置，站内链接直接写站点路径，自己的代码放进 `extend` 局部模板。' },
  { date = 2026-10-09, title = 'Pele 图表', summary = '`pele` 代码块用 Mermaid 语法渲染图表，**只在** 含有图表的页面加载。' },
  { date = 2026-08-14, title = '受保护的文章', summary = '用密码保护页面目录，构建后由 `tools/protect/seal.mjs` 加密，再用 `verify.mjs` 校验。' },
  { date = 2026-06-20, title = '画廊与实况照片', summary = '纯 CSS 实现的等高画廊，以及把静态照片和短视频配成一对的 `live-photo` shortcode。' },
  { date = 2026-05-02, title = '音频与视频播放器', summary = '`music`、`playlist`、`video`，以及注重隐私的 `youtube` shortcode。' },
  { date = 2026-02-01, title = '站内搜索', summary = '搜索页使用构建时生成的 JSON 索引，不依赖外部服务。' },
  { date = 2025-12-03, title = '第一次提交', summary = '一个强调色，没有任何前端依赖。' },
]
+++

+++
title = '代码与图表'
date = 2026-11-14T10:00:00+08:00
images = ['covers/code-and-diagrams.webp']
description = '多种语言的代码高亮，以及用文字画出的图表。'
tags = ['代码', '图表', 'Markdown']
categories = ['示例']
+++

这些写法见 [代码](/docs/writing/#code) 和 [图表](/docs/writing/#diagrams) 文档。

搭建这个站点时留下的几段代码，外加三张说明它如何运转的图。

## 代码

用 `hugo server -D` 启动预览，再按喜好调整 `--color-accent` 这个变量。

```go
package main

import "fmt"

// main 打印一句问候。
func main() {
	msg := "你好，Icy"
	fmt.Println(msg, 42)
}
```

所有配色都来自这一个设置：

```toml {title="hugo.toml" linenos=true hl_lines=[3]}
[params.style]
  # 整个主题的配色都从这一个颜色推算
  accent = '#b75133'
```

一个小模块，从文件的第 12 行开始：

```js {filename="assets/js/modules/hello.js" linenos=true linenostart=12 hl_lines=["2-3"]}
export function greet(root = document) {
  for (const el of root.querySelectorAll("[data-greet]")) {
    el.textContent = `你好，${el.dataset.greet ?? "世界"}`;
  }
}
```

### 几种语言

```html
<p class="greeting">
  你好，{{ .Site.Params.author.name | default "读者" }}！
</p>
```

```css
.prose mark {
  background: light-dark(oklch(90% 0.13 95 / 0.78), oklch(62% 0.11 85 / 0.42));
}
```

```python
from pathlib import Path

def word_count(site: Path) -> int:
    """统计 content/ 下所有 Markdown 文件的词数。"""
    return sum(len(p.read_text("utf-8").split()) for p in (site / "content").rglob("*.md"))
```

```rust
fn main() {
    let posts = ["markdown-and-typography", "writing-tools", "code-and-diagrams"];
    for (i, slug) in posts.iter().enumerate() {
        println!("{:>2}. /posts/{slug}/", i + 1);
    }
}
```

```sh
hugo --minify --panicOnWarning --cleanDestinationDir --destination public
node themes/hugo-theme-icy/tools/protect/seal.mjs public
node themes/hugo-theme-icy/tools/protect/verify.mjs public
```

### 长行、diff 与纯文本

```js
const message = "这一行故意写得很长，长到超出正文栏的宽度，用来检查代码块能否自己横向滚动，而页面的其他部分保持不动。This line is deliberately long.";
```

上周配置文件的改动：

```diff
 [params.style]
-  accent = '#2f6f9f'
+  accent = '#b75133'
 [params.search]
   page = '/search'
+[params.rss]
+  fullText = true
```

```
没有语言，也就没有高亮。
    空白按原样保留。
```

## 图表

这个站点从 Markdown 到上线的过程：

```pele
flowchart TD
  accTitle: 从 Markdown 到上线
  accDescr: Hugo 把内容和主题渲染到 public，加密脚本处理受保护的文章，校验脚本检查输出，最后部署。
  content["content/<br/>Markdown 与页面资源"] --> hugo
  theme["themes/hugo-theme-icy<br/>模板 · CSS · JS"] --> hugo
  hugo["hugo --minify"] --> public["public/"]
  public --> seal{"有受保护<br/>的文章？"}
  seal -->|有| encrypt["seal.mjs<br/>原地加密"]
  seal -->|没有| verify
  encrypt --> verify["verify.mjs"]
  verify --> deploy(["部署"])
```

而我每天实际在走的循环：

```pele
flowchart LR
  write[写作] -->|hugo server| preview[预览]
  preview -->|没问题| build[构建]
  preview -.->|有错字| write
  build --> publish((发布))
```

打开一篇受密码保护的文章时，密码始终不会离开浏览器：

```pele
sequenceDiagram
  accTitle: 解锁受保护的文章
  accDescr: 读者输入密码，浏览器在本地派生密钥并解密内容，整个过程不询问服务器。
  actor R as 读者
  participant B as 浏览器
  participant S as 静态主机
  R->>B: 打开文章
  B->>S: 请求页面
  S-->>B: 带密文的 HTML
  R->>B: 输入密码
  Note over B: PBKDF2 派生密钥，<br/>AES-GCM 解密内容
  alt 密码正确
    B-->>R: 显示文章
  else 密码错误
    B-->>R: 请重新输入
  end
```

页头的深浅色切换按钮：

```pele
stateDiagram-v2
  accTitle: 深浅色切换
  accDescr: 页面跟随系统配色，读者切换后改用手动设置；切换回与系统一致时，保存的设置会被清除。
  state "跟随系统" as System
  state "手动设置" as Override
  [*] --> System
  System --> Override: 切换
  Override --> System: 切换回来
  System --> System: 系统配色变化
  note right of Override
    只在与系统不同时
    才保存下来
  end note
```

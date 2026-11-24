+++
title = 'Code and diagrams'
date = 2026-11-14T10:00:00+08:00
images = ['covers/code-and-diagrams.webp']
description = 'Highlighted code in several languages, and diagrams drawn from text.'
tags = ['Code', 'Diagrams', 'Markdown']
categories = ['Examples']
+++

How to write these: [Writing](/docs/writing/#code) and [Diagrams](/docs/writing/#diagrams).

A few snippets from building this site, and three diagrams of how it fits together.

## Code

Start the preview with `hugo server -D` and change the `--color-accent` token to taste.

```go
package main

import "fmt"

// main prints a greeting.
func main() {
	msg := "Hello, Icy"
	fmt.Println(msg, 42)
}
```

The one setting the colors come from:

```toml {title="hugo.toml" linenos=true hl_lines=[3]}
[params.style]
  # The one color the whole theme derives from
  accent = '#b75133'
```

A small module, starting at line 12 of its file:

```js {filename="assets/js/modules/hello.js" linenos=true linenostart=12 hl_lines=["2-3"]}
export function greet(root = document) {
  for (const el of root.querySelectorAll("[data-greet]")) {
    el.textContent = `Hello, ${el.dataset.greet ?? "world"}`;
  }
}
```

### A few languages

```html
<p class="greeting">
  Hello, {{ .Site.Params.author.name | default "reader" }}!
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
    """Count the words in every Markdown file under content/."""
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

### Long lines, diffs and plain text

```js
const message = "This line is deliberately long so that it overflows the reading column and you can check that the code block scrolls on its own while the rest of the page stays put.";
```

What changed in the config last week:

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
No language, no highlighting.
    Whitespace is kept exactly as written.
```

## Diagrams

How this site goes from Markdown to the web:

```pele
flowchart TD
  accTitle: From Markdown to a deployed site
  accDescr: Hugo renders content and theme into public, the seal script encrypts protected posts, verify checks the output, and the files are deployed.
  content["content/<br/>Markdown and bundles"] --> hugo
  theme["themes/hugo-theme-icy<br/>templates · CSS · JS"] --> hugo
  hugo["hugo --minify"] --> public["public/"]
  public --> seal{"Protected<br/>posts?"}
  seal -->|yes| encrypt["seal.mjs<br/>encrypt in place"]
  seal -->|no| verify
  encrypt --> verify["verify.mjs"]
  verify --> deploy(["Deploy"])
```

And the loop I actually live in:

```pele
flowchart LR
  write[Write] -->|hugo server| preview[Preview]
  preview -->|looks right| build[Build]
  preview -.->|typo| write
  build --> publish((Publish))
```

Opening a password-protected post. The password never leaves the browser:

```pele
sequenceDiagram
  accTitle: Unlocking a protected post
  accDescr: The reader enters a password, the browser derives a key and decrypts the sealed content locally; the server is never asked.
  actor R as Reader
  participant B as Browser
  participant S as Static host
  R->>B: Open the post
  B->>S: GET the post
  S-->>B: HTML with sealed ciphertext
  R->>B: Enter the password
  Note over B: PBKDF2 derives the key,<br/>AES-GCM decrypts the content
  alt Correct password
    B-->>R: Show the article
  else Wrong password
    B-->>R: Ask again
  end
```

The scheme toggle in the header:

```pele
stateDiagram-v2
  accTitle: The color scheme toggle
  accDescr: The page follows the system scheme until the reader toggles it; toggling back to the system scheme clears the stored override.
  [*] --> System
  System --> Override: toggle
  Override --> System: toggle back
  System --> System: OS scheme changes
  note right of Override
    Stored only while it
    differs from the system
  end note
```

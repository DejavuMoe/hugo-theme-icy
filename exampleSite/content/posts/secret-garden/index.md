+++
title = 'Protected post example'
date = 2026-11-02T10:00:00+08:00
description = 'A password-protected post, decrypted in your browser.'
tags = ['Security']
categories = ['Examples']
[protected]
  enabled = true
  password = 'icy'
  hint = "The theme's name, in lowercase"
+++

How to protect a post: [Protected posts](/docs/protected-posts/).

You found the way in. Everything below the title was encrypted after the build and decrypted just now, in your browser. The password never left it.

The photos were encrypted too:

![A path through purple flowers to Lake Atitlán, with volcanoes under a violet sunset sky](atitlan-path.webp "Decrypted a moment ago")

{{< gallery caption="A gallery, also decrypted on the spot" >}}
  {{< gallery-item src="waterfall-bridge.webp" alt="A tall waterfall falling behind a stone footbridge in a green gorge" >}}
  {{< gallery-item src="orange-flowers.webp" alt="Orange poppies above a field of grass against a pale sky" >}}
{{< /gallery >}}

{{< live-photo src="yogurt.jpg" video="yogurt.mp4" alt="Yogurt, the cat" caption="Yogurt kept a secret too" >}}

Everything else works as on any other page:

```js {title="secret.js"}
console.log("Only those who know the password can see this");
```

{{< details summary="A collapsible note" >}}
Still opens and closes after unlocking.
{{< /details >}}

And a footnote to hover[^note].

[^note]: This footnote was part of the ciphertext too.

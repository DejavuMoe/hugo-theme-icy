+++
title = 'Protected posts'
description = 'Lock a post with a password and deploy it safely.'
weight = 60
date = 2026-11-24
images = ['covers/protected-posts.webp']
+++

A protected post shows its title and a password field. After the build, a script encrypts the post and every file in its bundle. The reader's browser decrypts them when the password is right. The [Showcase](/posts/) has one to try, *Protected post example*; its hint gives the password away.

This keeps casual readers out, not determined ones: read [How safe it is](#security) before you rely on it.

## Protect a post {#protect}

A protected post must be a leaf bundle: a directory with `index.md` and the files the post uses.

```text
content/posts/secret/
├── index.md
├── photo.jpg
└── notes.pdf
```

Turn protection on in the front matter. Everything below the front matter, and every file in the directory, is encrypted.

{{< code-toggle file="content/posts/secret/index" fm=true >}}
title = 'Secret'
date = 2026-11-21
[protected]
  enabled = true
  password = 'a long passphrase'
  hint = 'Shown above the password field'
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `enabled` | `false` | `true` turns protection on. |
| `password` | — | Required, or the build fails. Use a long passphrase. |
| `hint` | — | Shown above the password field. Public. |

Only files inside the bundle are encrypted. Files in `static/`, `assets/` or another page's bundle, local copies of remote images, and remote audio or video stay public. Don't give a protected post a cover image; it is never shown.

## What stays public {#public}

| Public | Encrypted |
| --- | --- |
| Title, date and hint | The content |
| The post's line in archives, tag pages and the home page | Every file in the bundle, with its resized versions |
| Comments and analytics, if enabled | |

A protected post has no table of contents, tags, cover, social image, copyright card or structured data. It is marked `noindex` and left out of search, feeds, the sitemap and the tag counts. To turn off comments or analytics on it too, set `comments = false` or `analytics = false`.

> [!WARNING]
> Never link to a protected post from a public page. With full-text RSS the link ends up in the feeds, and `verify.mjs` fails on any protected route it finds there. Mention the post by name instead.

## Translations {#translations}

On a multilingual site, protect every translation of a post, or none. Each translation needs its own `[protected]` table, and the passwords may differ. Translations share the bundle's files, so protecting only some of them fails sealing or publishes the files unencrypted.

## Seal and verify {#seal}

Encryption is a step after `hugo`. Run these three commands locally and in CI:

```sh
hugo --gc --minify --cleanDestinationDir
node themes/hugo-theme-icy/tools/protect/seal.mjs public
node themes/hugo-theme-icy/tools/protect/verify.mjs public
```

- `seal.mjs` encrypts each protected post, deletes the plaintext, and removes tag pages that list only protected posts. `--dry-run` shows what it would do.
- `verify.mjs` checks that every protected post is sealed and that no protected route appears in feeds, the sitemap or the search index. It exits with code 1 on any error.

Always build into a clean directory, or `seal.mjs` stops. It also stops, changing nothing, when a protected post is not a leaf bundle or a public page uses its files. [Deployment](/docs/deployment/) has complete pipelines with these steps.

## Preview the sealed site {#preview}

`hugo server` doesn't seal, so it can't show real decryption. `preview.mjs` builds, seals, verifies and serves the result locally:

```sh
node themes/hugo-theme-icy/tools/protect/preview.mjs
```

| Option | Default | Description |
| --- | --- | --- |
| `--site DIR` | Current directory | The Hugo site. |
| `--destination DIR` | `<site>/public` | Output directory, inside the site. It is cleaned. |
| `--drafts` | Off | Include drafts and future posts. |
| `--build-only` | Off | Stop after verifying. |
| `--no-build` | Off | Serve an existing sealed output. |
| `--port N` | `1313` | Port. |
| `--host H` | `127.0.0.1` | Address. |

## The build warning {#warning}

A production build logs a warning for each protected post, reminding you to seal it:

```text
WARN icy: /posts/secret/ is password-protected; run tools/protect/seal.mjs (and verify.mjs) on the output before deploying
```

A build with `--panicOnWarning` fails on it. Once every deployment seals and verifies, silence it:

{{< code-toggle file="hugo" >}}
ignoreLogs = ['icy-protected-unsealed']
{{< /code-toggle >}}

## How safe it is {#security}

This hides content in the browser; it is not access control on the server. The encrypted file is public, so a weak password can be guessed offline, and anyone who unlocks the post can copy it. The password never leaves the browser and is not stored.

The password is written in the post's front matter, so anyone who can read your site's source can read it too. Keep the source repository private, or don't protect posts on that site.

The format and the cryptography are explained in the author's article [Hugo 实现页面加密](https://blog.dejavu.moe/posts/hugo-protected-leaf-bundle-encryption/) (in Chinese).

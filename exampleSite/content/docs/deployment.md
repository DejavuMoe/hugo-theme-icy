+++
title = 'Deployment'
description = 'Build for production and publish to a host or your own server.'
weight = 100
date = 2026-11-24
images = ['covers/deployment.webp']
+++

An Icy site is static files: build it, seal it, upload the output directory. The tools you need are listed in [Getting started](/docs/installation/#requirements).

## Production build {#build}

Set `baseURL` to the address the site is served from. Feeds, canonical links and the sitemap use it.

{{< code-toggle file="hugo" >}}
baseURL = 'https://blog.example.com/'
{{< /code-toggle >}}

Then build, seal and verify:

```sh
hugo --gc --minify --cleanDestinationDir
node themes/hugo-theme-icy/tools/protect/seal.mjs public
node themes/hugo-theme-icy/tools/protect/verify.mjs public
```

Deploy only when all three succeed. The two scripts encrypt and check [protected posts](/docs/protected-posts/#seal); on a site without any they pass at once, so keep them in every pipeline.

| Flag | Why |
| --- | --- |
| `--gc` | Removes unused files from Hugo's caches. |
| `--minify` | Minifies HTML, XML and JSON. |
| `--cleanDestinationDir` | Removes files from earlier builds. Required for sealing. |
| `--panicOnWarning` | Optional. Fails the build on any warning. |

To upload by hand, copy `public/` to your server:

```sh
rsync -avz --delete-after --delay-updates public/ deploy@example.com:/srv/example.com/html/
```

`--delay-updates` swaps in every changed file at the end, so readers never get a page whose stylesheet hasn't arrived yet.

## Network access during the build {#network}

The build downloads repository data, YouTube thumbnails, remote images and remote friend avatars. When a download fails, it logs a warning with the id `icy-remote-fetch` and carries on:

| Download | Fallback |
| --- | --- |
| Repository data | The card shows only the owner, the name and the link. |
| YouTube thumbnail | A plain poster. Set `poster=` to avoid it. |
| Remote image | Linked from its original host, without a size or WebP versions. |
| Friend avatar | The first letter of the name. |

With `--panicOnWarning`, the failure stops the deployment instead. If your build server may lack network and you'd rather deploy the fallbacks, silence the warning:

{{< code-toggle file="hugo" >}}
ignoreLogs = ['icy-remote-fetch']
{{< /code-toggle >}}

## GitHub token {#github-token}

GitHub allows 60 anonymous API requests an hour per IP address, and a shared CI runner can use them up. Repository cards then fall back to plain links. A token raises the limit.

The build reads the token from the `HUGO_GITHUB_TOKEN` environment variable only. Store it as a secret in your CI and never in a config file. It is sent only to `api.github.com` and never appears in the built site.

- In GitHub Actions, pass the workflow's built-in token, `${{ secrets.GITHUB_TOKEN }}`. You don't need your own.
- Elsewhere, create one on GitHub under Settings → Developer settings → Personal access tokens → Fine-grained tokens. Choose "Public repositories (read-only)", add no permissions and set an expiry date.

On your own machine, set it for one command:

```sh
HUGO_GITHUB_TOKEN=github_pat_… hugo --gc --minify
```

## Caches {#caches}

Keep two directories between CI runs, so most builds download and resize nothing:

| Directory | Holds | Location |
| --- | --- | --- |
| Cache | Downloads: repository data, remote images, thumbnails | `HUGO_CACHEDIR`, by default the system cache directory |
| Resources | Processed images: resized versions, cropped avatars | `resources/_gen` in the site, or `HUGO_RESOURCEDIR` |

`resources/_gen` saves the most time on a site with many photos. Downloads never expire unless you set a lifetime:

{{< code-toggle file="hugo" >}}
[caches.getresource]
  maxAge = '24h'
{{< /code-toggle >}}

## Headers and 404 pages {#headers}

In a production build, the theme's CSS, JavaScript and search index files carry a 64-character hash in their names, such as `css/core.<hash>.css`. Their content never changes, so browsers can keep them for a year. Everything else must be revalidated after each deployment.

| Path | `Cache-Control` |
| --- | --- |
| Ending in `.<64 hex digits>.css`, `.js` or `.json` | `public, max-age=31536000, immutable` |
| Everything else | `no-cache` |

Your web server should also:

- serve `404.html` with status 404 for missing paths, and `/zh-cn/404.html` under each language prefix;
- answer range requests, so audio and video can seek;
- compress text, but not images or media;
- send `X-Content-Type-Options: nosniff`, a `Referrer-Policy` and `Content-Security-Policy: frame-ancestors 'self'`.

The recipes below do all of this.

## GitHub Pages {#github-pages}

In the repository's Settings → Pages, set Source to "GitHub Actions". Then commit this workflow. It assumes the theme is a Git submodule.

```yaml {title=".github/workflows/deploy.yml"}
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.170.0
    steps:
      - uses: actions/checkout@v7
        with:
          submodules: recursive
          fetch-depth: 0

      - id: pages
        uses: actions/configure-pages@v6

      - uses: actions/setup-node@v7
        with:
          node-version: lts/*

      - name: Install Hugo
        run: |
          curl -fsSLo "$RUNNER_TEMP/hugo.deb" \
            "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-amd64.deb"
          sudo dpkg -i "$RUNNER_TEMP/hugo.deb"

      - uses: actions/cache@v6
        with:
          path: |
            ${{ runner.temp }}/hugo_cache
            resources/_gen
          key: hugo-${{ github.run_id }}
          restore-keys: hugo-

      - name: Build, seal and verify
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          hugo --gc --minify --cleanDestinationDir --baseURL "${{ steps.pages.outputs.base_url }}/"
          node themes/hugo-theme-icy/tools/protect/seal.mjs public
          node themes/hugo-theme-icy/tools/protect/verify.mjs public

      - uses: actions/upload-pages-artifact@v5
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- `--baseURL` takes the address GitHub Pages reports, including a custom domain.
- If you installed the theme as a Hugo module, drop `submodules: recursive` and add `actions/setup-go` before the build.
- GitHub Pages serves the root `404.html` for every missing path. It doesn't let you set headers.

For a custom domain, enter it under Settings → Pages → Custom domain and point its DNS at GitHub Pages, such as a `CNAME` record to `<user>.github.io`. Without one, a project site lives under `/<repo>/`. The theme's own links follow that sub-path, but a root-relative link you write to a file in `static/` does not.

## Cloudflare Pages {#cloudflare-pages}

Create a Pages project from your Git repository with these settings:

| Setting | Value |
| --- | --- |
| Build command | `sh build.sh` |
| Build output directory | `public` |
| `HUGO_VERSION` | `0.170.0`. The build image's default Hugo is too old. |
| `HUGO_GITHUB_TOKEN` | Optional, type Secret: a [GitHub token](#github-token). |

Add variables under Settings → Variables and Secrets, for both production and preview. The build image already has Node.js for sealing. A public theme submodule works; each entry in `.gitmodules` needs a `path` and a `url`.

Commit `build.sh` at the root of the site. Preview deployments build for their own `*.pages.dev` address:

```sh {title="build.sh"}
#!/bin/sh
set -eu

if [ "${CF_PAGES_BRANCH:-}" = "main" ]; then
  hugo --gc --minify --cleanDestinationDir
else
  hugo --gc --minify --cleanDestinationDir --baseURL "$CF_PAGES_URL/"
fi

node themes/hugo-theme-icy/tools/protect/seal.mjs public
node themes/hugo-theme-icy/tools/protect/verify.mjs public
```

Cloudflare serves the nearest `404.html` with status 404 and handles compression and range requests. A single file may not exceed 25 MiB, which matters for long videos. Set the [caching headers](#headers) with this file:

```text {title="static/_headers"}
/css/*
  Cache-Control: public, max-age=31536000, immutable
/js/*
  Cache-Control: public, max-age=31536000, immutable
/search/*.json
  Cache-Control: public, max-age=31536000, immutable
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: frame-ancestors 'self'
```

If you put unhashed files of your own in `static/css/` or `static/js/`, narrow those rules.

To build elsewhere and only upload, for example with a private theme, create a Direct Upload project and deploy the sealed `public/` with Wrangler. In CI it reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from the environment.

```sh
npx wrangler pages deploy public --project-name my-site --branch main
```

## Woodpecker CI {#woodpecker}

This pipeline builds in a Hugo image with Node.js, uploads over SSH into a new release directory, then switches a `current` symlink to it. Readers never see a half-copied site.

```yaml {title=".woodpecker/deploy.yml"}
when:
  - event: [push, manual]
    branch: main

steps:
  - name: build
    image: hugomods/hugo:std-node-git-0.165.0
    environment:
      HUGO_CACHEDIR: /cache/hugo
      HUGO_RESOURCEDIR: /cache/resources
      HUGO_GITHUB_TOKEN:
        from_secret: github_token
    volumes:
      - icy_hugo_cache:/cache
    commands:
      - hugo --gc --minify --cleanDestinationDir
      - node themes/hugo-theme-icy/tools/protect/seal.mjs public
      - node themes/hugo-theme-icy/tools/protect/verify.mjs public

  - name: deploy
    image: alpine:3.22
    environment:
      DEPLOY_HOST: example.com
      DEPLOY_USER: deploy
      DEPLOY_PATH: /srv/example.com
      SSH_KEY:
        from_secret: deploy_ssh_key
      SSH_KNOWN_HOSTS:
        from_secret: deploy_known_hosts
    commands:
      - apk add --no-cache openssh-client rsync
      - |
        set -eu
        mkdir -p ~/.ssh && chmod 700 ~/.ssh
        printf '%s\n' "$SSH_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519
        printf '%s\n' "$SSH_KNOWN_HOSTS" > ~/.ssh/known_hosts
        target="$DEPLOY_USER@$DEPLOY_HOST"
        release="$CI_COMMIT_SHA-$CI_PIPELINE_NUMBER"

        # Start from hard links of the live release, so rsync sends only changes.
        ssh "$target" "set -eu; mkdir -p '$DEPLOY_PATH/releases'
          if [ -d '$DEPLOY_PATH/current' ]; then cp -al '$DEPLOY_PATH/current/' '$DEPLOY_PATH/releases/$release'; fi"
        rsync -rlptz --delete public/ "$target:$DEPLOY_PATH/releases/$release/"

        # Switch atomically, then keep the three newest releases.
        ssh "$target" "set -eu; cd '$DEPLOY_PATH'
          ln -sfn 'releases/$release' .current.tmp
          mv -Tf .current.tmp current
          ls -1dt releases/*/ | tail -n +4 | xargs -r rm -rf --"
```

| Secret | Value |
| --- | --- |
| `deploy_ssh_key` | A private key used only for deployments. |
| `deploy_known_hosts` | The server's host key line, from `ssh-keyscan -t ed25519 example.com`. |
| `github_token` | Optional: a [GitHub token](#github-token). |

- On the server, create a `deploy` user that can write to `/srv/example.com`, with GNU coreutils and rsync. Point the web server at `/srv/example.com/current`.
- The cache volume needs a trusted repository, an administrator setting. Without one, remove `volumes`; builds are slower but identical.
- Write variables in commands as `$NAME`: Woodpecker replaces `${NAME}` itself before the shell runs.
- To roll back, point `current` at an earlier directory in `releases/` with the same `ln` and `mv`.

## Caddy {#caddy}

Caddy 2.8 or later. It gets the certificate and redirects to HTTPS by itself.

```caddy {title="Caddyfile"}
(icy_headers) {
	header {
		Strict-Transport-Security "max-age=31536000"
		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		Content-Security-Policy "frame-ancestors 'self'"
	}
}

example.com {
	root * /srv/example.com/current
	encode zstd gzip
	import icy_headers
	header Cache-Control "no-cache"

	# Only 2xx and 304 get the long lifetime, so a missing asset isn't cached.
	@fingerprinted path_regexp \.[0-9a-f]{64}\.(css|js|json)$
	header @fingerprinted {
		>Cache-Control "public, max-age=31536000, immutable"
		match status 2xx 304
	}

	file_server

	# One rewrite per language prefix. Error routes skip the site's
	# encode and headers, so they are repeated here.
	handle_errors 404 {
		@zh path /zh-cn/*
		rewrite @zh /zh-cn/404.html
		rewrite * /404.html
		encode zstd gzip
		import icy_headers
		header Cache-Control "no-cache"
		file_server
	}
}
```

## nginx {#nginx}

Save as `/etc/nginx/conf.d/example.com.conf`; the `map` must sit at the `http` level, which `conf.d` files are. Certificates come from your ACME client.

```nginx {title="/etc/nginx/conf.d/example.com.conf"}
map $uri $icy_cache_control {
    "~\.[0-9a-f]{64}\.(css|js|json)$"  "public, max-age=31536000, immutable";
    default                            "no-cache";
}

server {
    listen 80;
    listen [::]:80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name example.com;

    ssl_certificate     /etc/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/ssl/example.com/privkey.pem;

    root  /srv/example.com/current;
    index index.html;
    charset utf-8;
    absolute_redirect off;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/plain text/xml application/javascript text/javascript
               application/json application/xml application/rss+xml image/svg+xml
               application/manifest+json;

    # Keep every add_header here: one inside a location would drop these.
    add_header Cache-Control $icy_cache_control always;
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "frame-ancestors 'self'" always;

    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # One block per language prefix.
    location /zh-cn/ {
        error_page 404 /zh-cn/404.html;
        try_files $uri $uri/ =404;
    }

    location ~ \.webmanifest$ {
        default_type application/manifest+json;
    }
}
```

`http2 on` needs nginx 1.25.1 or later. `absolute_redirect off` keeps the redirect from `/docs` to `/docs/` on the public host name.

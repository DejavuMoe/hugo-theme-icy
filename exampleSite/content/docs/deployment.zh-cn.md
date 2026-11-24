+++
title = '部署'
description = '生产构建，并发布到托管平台或自己的服务器。'
weight = 100
date = 2026-11-24
images = ['covers/deployment.webp']
+++

Icy 站点就是一堆静态文件：构建、封存，然后上传输出目录。所需的工具见 [快速开始](/docs/installation/#requirements)。

## 生产构建 {#build}

把 `baseURL` 设为站点的实际访问地址，订阅源、canonical 链接和站点地图都会用到它。

{{< code-toggle file="hugo" >}}
baseURL = 'https://blog.example.com/'
{{< /code-toggle >}}

然后构建、封存并校验：

```sh
hugo --gc --minify --cleanDestinationDir
node themes/hugo-theme-icy/tools/protect/seal.mjs public
node themes/hugo-theme-icy/tools/protect/verify.mjs public
```

三条命令全部成功才能部署。后两个脚本负责加密和检查 [受保护文章](/docs/protected-posts/#seal)；站点里没有受保护文章时它们会直接通过，所以每条流水线都保留它们。

| 参数 | 作用 |
| --- | --- |
| `--gc` | 清除 Hugo 缓存中没用到的文件。 |
| `--minify` | 压缩 HTML、XML 和 JSON。 |
| `--cleanDestinationDir` | 删除旧构建留下的文件。封存必须这样做。 |
| `--panicOnWarning` | 可选。出现任何警告都让构建失败。 |

手动上传时，把 `public/` 复制到服务器上：

```sh
rsync -avz --delete-after --delay-updates public/ deploy@example.com:/srv/example.com/html/
```

`--delay-updates` 在传输结束时才把改动的文件一起换上，读者不会拿到样式表还没传到的新页面。

## 构建时的网络访问 {#network}

构建时会下载仓库数据、YouTube 缩略图、远程图片和远程友链头像。下载失败时，构建输出一条 id 为 `icy-remote-fetch` 的警告，并继续进行：

| 下载内容 | 替代方案 |
| --- | --- |
| 仓库数据 | 卡片只显示所有者、仓库名和链接。 |
| YouTube 缩略图 | 朴素的封面。写上 `poster=` 可以避免。 |
| 远程图片 | 直接引用原始主机上的图片，没有尺寸和 WebP 版本。 |
| 友链头像 | 名字的第一个字。 |

带 `--panicOnWarning` 时，下载失败会拦下部署。如果构建服务器可能没有网络，而你宁愿部署替代内容，就屏蔽这条警告：

{{< code-toggle file="hugo" >}}
ignoreLogs = ['icy-remote-fetch']
{{< /code-toggle >}}

## GitHub 令牌 {#github-token}

GitHub 对匿名 API 请求的限制是每个 IP 地址每小时 60 次，共享的 CI 机器很容易用完，仓库卡片随之退化成普通链接。令牌可以提高这个上限。

构建只从环境变量 `HUGO_GITHUB_TOKEN` 读取令牌。请把它存成 CI 的密钥，永远不要写进配置文件。令牌只发送给 `api.github.com`，不会出现在生成的站点里。

- 在 GitHub Actions 里，直接传入工作流自带的 `${{ secrets.GITHUB_TOKEN }}`，不需要自己创建。
- 在其他地方，到 GitHub 的 Settings → Developer settings → Personal access tokens → Fine-grained tokens 创建一个。选择“Public repositories (read-only)”，不添加任何权限，并设置过期时间。

在自己的电脑上，只为一条命令设置它：

```sh
HUGO_GITHUB_TOKEN=github_pat_… hugo --gc --minify
```

## 缓存 {#caches}

在多次 CI 运行之间保留两个目录，大多数构建就不必重新下载和缩放：

| 目录 | 存放内容 | 位置 |
| --- | --- | --- |
| 缓存目录 | 下载的文件：仓库数据、远程图片、缩略图 | `HUGO_CACHEDIR`，默认在系统缓存目录 |
| 资源目录 | 处理过的图片：缩放版本、裁剪后的头像 | 站点内的 `resources/_gen`，或 `HUGO_RESOURCEDIR` |

照片多的站点，`resources/_gen` 最省时间。下载的文件默认永不过期，除非你设置有效期：

{{< code-toggle file="hugo" >}}
[caches.getresource]
  maxAge = '24h'
{{< /code-toggle >}}

## 响应头与 404 页面 {#headers}

生产构建中，主题的 CSS、JavaScript 和搜索索引文件名里带有 64 位的哈希，例如 `css/core.<hash>.css`。它们的内容永远不变，浏览器可以缓存一年。其他文件在每次部署后都必须重新验证。

| 路径 | `Cache-Control` |
| --- | --- |
| 以 `.<64 位十六进制>.css`、`.js` 或 `.json` 结尾 | `public, max-age=31536000, immutable` |
| 其他所有文件 | `no-cache` |

Web 服务器还应当：

- 对缺失的路径返回 `404.html` 和状态码 404，每种语言的前缀下返回对应的 `/zh-cn/404.html`；
- 支持范围请求，让音频和视频可以拖动进度；
- 压缩文本，但不压缩图片和音视频；
- 发送 `X-Content-Type-Options: nosniff`、`Referrer-Policy` 和 `Content-Security-Policy: frame-ancestors 'self'`。

下面的配置都做到了这些。

## GitHub Pages {#github-pages}

在仓库的 Settings → Pages 中，把 Source 设为“GitHub Actions”，然后提交这个工作流。它假定主题是 Git 子模块。

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

- `--baseURL` 取 GitHub Pages 报告的地址，自定义域名也包括在内。
- 如果以 Hugo 模块安装主题，去掉 `submodules: recursive`，并在构建前加上 `actions/setup-go`。
- GitHub Pages 对所有缺失的路径返回根目录的 `404.html`，也不允许设置响应头。

使用自定义域名时，在 Settings → Pages → Custom domain 中填写域名，并让它的 DNS 指向 GitHub Pages，例如一条指向 `<user>.github.io` 的 `CNAME` 记录。没有自定义域名时，项目站点位于 `/<repo>/` 之下。主题自己的链接会跟随这个子路径，但你手写的、指向 `static/` 中文件的根路径链接不会。

## Cloudflare Pages {#cloudflare-pages}

从 Git 仓库创建一个 Pages 项目，设置如下：

| 设置 | 值 |
| --- | --- |
| Build command | `sh build.sh` |
| Build output directory | `public` |
| `HUGO_VERSION` | `0.170.0`。构建镜像默认的 Hugo 太旧。 |
| `HUGO_GITHUB_TOKEN` | 可选，类型选 Secret：一个 [GitHub 令牌](#github-token)。 |

变量在 Settings → Variables and Secrets 中添加，生产环境和预览环境都要加。构建镜像自带封存所需的 Node.js。公开的主题子模块可以直接使用，`.gitmodules` 中的每一项都需要 `path` 和 `url`。

在站点根目录提交 `build.sh`。预览部署会以自己的 `*.pages.dev` 地址构建：

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

Cloudflare 会返回最近的 `404.html` 和状态码 404，并自行处理压缩和范围请求。单个文件不能超过 25 MiB，长视频要注意。用这个文件设置 [缓存响应头](#headers)：

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

如果你在 `static/css/` 或 `static/js/` 里放了不带哈希的自有文件，请收窄这些规则。

想在别处构建、只上传到 Cloudflare 时，例如主题是私有仓库，就创建一个 Direct Upload 项目，用 Wrangler 部署封存后的 `public/`。在 CI 中，它从环境变量读取 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。

```sh
npx wrangler pages deploy public --project-name my-site --branch main
```

## Woodpecker CI {#woodpecker}

这条流水线在带 Node.js 的 Hugo 镜像中构建，通过 SSH 上传到一个新的版本目录，再把 `current` 符号链接切换过去。读者永远不会看到复制到一半的站点。

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

        # 以当前版本的硬链接为起点，rsync 只传输改动。
        ssh "$target" "set -eu; mkdir -p '$DEPLOY_PATH/releases'
          if [ -d '$DEPLOY_PATH/current' ]; then cp -al '$DEPLOY_PATH/current/' '$DEPLOY_PATH/releases/$release'; fi"
        rsync -rlptz --delete public/ "$target:$DEPLOY_PATH/releases/$release/"

        # 原子切换，然后只保留最新的三个版本。
        ssh "$target" "set -eu; cd '$DEPLOY_PATH'
          ln -sfn 'releases/$release' .current.tmp
          mv -Tf .current.tmp current
          ls -1dt releases/*/ | tail -n +4 | xargs -r rm -rf --"
```

| 密钥 | 值 |
| --- | --- |
| `deploy_ssh_key` | 仅用于部署的私钥。 |
| `deploy_known_hosts` | 服务器的主机密钥行，用 `ssh-keyscan -t ed25519 example.com` 获取。 |
| `github_token` | 可选：一个 [GitHub 令牌](#github-token)。 |

- 在服务器上创建一个能写入 `/srv/example.com` 的 `deploy` 用户，并装好 GNU coreutils 和 rsync。把 Web 服务器的根目录指向 `/srv/example.com/current`。
- 缓存卷要求仓库被设为可信，这是管理员设置。没有权限时删掉 `volumes`，构建会慢一些，结果相同。
- 命令中的变量写成 `$NAME`：Woodpecker 会在 shell 运行前自己替换 `${NAME}`。
- 要回滚，用同样的 `ln` 和 `mv` 把 `current` 指回 `releases/` 中较早的目录。

## Caddy {#caddy}

需要 Caddy 2.8 或更高版本。它会自动申请证书，并把 HTTP 重定向到 HTTPS。

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

	# 只有 2xx 和 304 响应使用长缓存，缺失的资源不会被缓存。
	@fingerprinted path_regexp \.[0-9a-f]{64}\.(css|js|json)$
	header @fingerprinted {
		>Cache-Control "public, max-age=31536000, immutable"
		match status 2xx 304
	}

	file_server

	# 每个语言前缀一条 rewrite。错误路由不经过站点的
	# encode 和 header，所以这里再写一遍。
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

保存为 `/etc/nginx/conf.d/example.com.conf`。`map` 必须位于 `http` 层级，`conf.d` 中的文件正是如此。证书由你的 ACME 客户端提供。

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

    # 所有 add_header 都写在这里：location 里只要有一条，就会丢掉这些。
    add_header Cache-Control $icy_cache_control always;
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "frame-ancestors 'self'" always;

    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 每个语言前缀一个 location。
    location /zh-cn/ {
        error_page 404 /zh-cn/404.html;
        try_files $uri $uri/ =404;
    }

    location ~ \.webmanifest$ {
        default_type application/manifest+json;
    }
}
```

`http2 on` 需要 nginx 1.25.1 或更高版本。`absolute_redirect off` 让 `/docs` 到 `/docs/` 的重定向保持使用公开的主机名。

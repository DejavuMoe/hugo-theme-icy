+++
title = '媒体'
description = '图片、图集、实况照片、音频和视频。'
weight = 40
date = 2026-11-24
images = ['covers/media.webp']
+++

Icy 在构建时读取图片尺寸，生成响应式 WebP 版本和模糊占位图，并用内置查看器打开图片。音频和视频播放器先用浏览器自带的控件，JavaScript 加载后换成主题的控件。

## 文件放在哪里 {#sources}

所有媒体路径，无论写在短代码还是 Markdown 图片里，都按以下顺序查找：

1. 页面包：与页面的 `index.md` 放在一起的 `photo.jpg`。
2. `assets/`：`images/photo.jpg` 对应 `assets/images/photo.jpg`。
3. 其他页面的页面包，按站点路径：`/posts/images-and-galleries/lake-boats.webp`。
4. `static/`，按站点路径：`/images/photo.jpg` 对应 `static/images/photo.jpg`。
5. 远程网址。

本地路径找不到文件时，构建失败。

前三处的图片会生成宽 480 到 2400 像素的 WebP 版本和占位图。`static/` 里的图片只读取尺寸。SVG 和 GIF 原样使用。

### 远程图片 {#remote-images}

远程图片在构建时下载，像本地图片一样处理，并从你的站点提供。读者不会访问原始主机。远程音频和视频按原网址链接。

下载失败时，图片直接引用原网址，没有尺寸和占位图，构建会输出 `icy-remote-fetch` 警告，见 [网络访问](/docs/deployment/#network)。为了让页面在这种情况下也不跳动，请用 `figure` 给远程图片写上尺寸：

```markdown
{{</* figure src="https://images.example.com/lake.jpg" alt="黎明时的湖" width="1600" height="1067" */>}}
```

## Markdown 图片 {#images}

独占一行的图片会渲染成 figure，图片标题作为图注。

![碧绿山湖上的几条小船](/posts/images-and-galleries/lake-boats.webp "山湖上等待出发的小船")

```markdown
![碧绿山湖上的几条小船](/posts/images-and-galleries/lake-boats.webp "山湖上等待出发的小船")
```

如果所有图片都渲染成行内小图，请加上 [快速开始](/docs/installation/#configure) 里的 Markdown 设置。图片下一行的 `{.class}` 会给 figure 加上 class。

夹在句子里的图片按文字高度绘制，像一个图标。悬停或点按时会显示放大的副本。

一朵虞美人 ![橙色虞美人](/posts/images-and-galleries/orange-flowers.webp) 夹在这句话里。

```markdown
一朵虞美人 ![橙色虞美人](/posts/images-and-galleries/orange-flowers.webp) 夹在这句话里。
```

## 图片查看器 {#viewer}

点击图片，会在查看器中打开。页面上所有图片组成一个序列，可以拿本页任意一张照片试试。

- 方向键、{{< kbd "Home" >}}、{{< kbd "End" >}} 或滑动在图片之间切换。
- 按 {{< kbd "Esc" >}} 或点击背景关闭查看器。
- 没有 JavaScript 时，点击会打开原尺寸文件。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `params.article.imageViewer` | `true` | `false` 在全站关闭查看器。 |

单张图片可以在 [figure](#figure) 上写 `zoom=false` 退出查看器。带链接的图片不会在查看器中打开。实况照片有单独的设置，见 [实况照片](#live-photo)。

## 封面图 {#covers}

文章在标题区下方显示封面。Icy 取 front matter `images` 的第一项；没有 `images` 时，取页面包里文件名含 `cover` 或 `feature` 的图片。

{{< code-toggle fm=true >}}
title = '湖边散步'
images = ['cover.jpg']
{{< /code-toggle >}}

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `params.article.cover` | `true` | `false` 在全站隐藏封面。 |
| front matter 中的 `hideCover` | `false` | `true` 隐藏本页封面。 |

`images` 里的远程网址只用于社交分享预览，不作为封面。受保护文章从不显示、也不分享封面。

## 图片与图注 {#figure}

一张图片，可带标题和图注，处理方式与 Markdown 图片相同。它取代 Hugo 内置的 `figure`。

{{< figure src="/posts/images-and-galleries/yosemite-river.webp" alt="黎明时优胜美地山谷里的河流，远处的崖壁笼在粉色雾气中" title="优胜美地山谷" caption="图注支持 **Markdown**。" >}}

```markdown
{{</* figure src="/posts/images-and-galleries/yosemite-river.webp" alt="黎明时优胜美地山谷里的河流，远处的崖壁笼在粉色雾气中" title="优胜美地山谷" caption="图注支持 **Markdown**。" */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `src` | 必填 | 图片。 |
| `alt` | `""` | 替代文本。 |
| `title` | — | 图注开头的加粗标题。 |
| `caption` | — | 图注，支持 Markdown。 |
| `link` | — | 图片链接到的网址，点击时不再打开查看器。 |
| `align` | `center` | `left` 或 `right` 把较窄的图片靠到这一侧，文字不环绕。 |
| `class` | — | 加在 `<figure>` 上的额外 class。 |
| `width`、`height` | 从文件读取 | SVG 必须写，远程图片建议写。 |
| `zoom` | `params.article.imageViewer` | `false` 让这张图片不进入查看器。 |
| `zoomSrc` | `src` | 在查看器中显示的更大图片。 |

## 图集 {#gallery}

两端对齐的照片行：每一行铺满宽度，同一行的照片高度相同。布局不需要 JavaScript。

{{< gallery caption="三个地方" >}}
  {{< gallery-item src="/posts/images-and-galleries/atitlan-path.webp" alt="紫色花丛间的小路通向阿蒂特兰湖，远处是火山和紫色晚霞" >}}
  {{< gallery-item src="/posts/images-and-galleries/foggy-summit.webp" alt="日出时雾气缭绕的绿色山崖和蜿蜒的公路" caption="每张照片都可以有自己的图注" >}}
  {{< gallery-item src="/posts/images-and-galleries/blue-ranges.webp" alt="层层叠叠、渐隐在雾气里的蓝色山脊" >}}
{{< /gallery >}}

```markdown
{{</* gallery caption="三个地方" */>}}
  {{</* gallery-item src="/posts/images-and-galleries/atitlan-path.webp" alt="紫色花丛间的小路通向阿蒂特兰湖，远处是火山和紫色晚霞" */>}}
  {{</* gallery-item src="/posts/images-and-galleries/foggy-summit.webp" alt="日出时雾气缭绕的绿色山崖和蜿蜒的公路" caption="每张照片都可以有自己的图注" */>}}
  {{</* gallery-item src="/posts/images-and-galleries/blue-ranges.webp" alt="层层叠叠、渐隐在雾气里的蓝色山脊" */>}}
{{</* /gallery */>}}
```

`gallery` 的参数：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `columns` | `auto` | 每行照片数，`1` 到 `4`。`auto` 时一两张排一行，四张每行两张，其他每行三张。 |
| `caption` | — | 整个图集的图注，支持 Markdown。 |
| `label` | — | 没有图注时的无障碍名称。 |

`gallery-item` 直接放在 `gallery` 里，参数如下：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `src` | 必填 | 图片。 |
| `alt` | `""` | 替代文本。 |
| `caption` | — | 照片下方的图注，支持 Markdown。 |
| `link` | — | 照片链接到的网址，点击时不再打开查看器。 |
| `width`、`height` | 从文件读取 | 照片尺寸。 |
| `ratio` | — | 宽高比，如 `4/3`，代替尺寸。 |
| `zoomSrc` | `src` | 在查看器中显示的更大图片。 |
| `loading` | `lazy` | `lazy` 或 `eager`。 |

布局需要知道每张照片的比例。读不到尺寸的照片，例如 SVG 或远程图片，要写 `width` 和 `height` 或 `ratio`，否则构建失败。

## 实况照片 {#live-photo}

一张静态照片配一段短视频，就像手机拍的实况照片。把鼠标移上去、长按，或者点 **LIVE**。

{{< live-photo src="/posts/live-photos/yogurt.jpg" video="/posts/live-photos/yogurt.mp4" alt="酸奶" caption="酸奶的两秒钟" >}}

```markdown
{{</* live-photo src="/posts/live-photos/yogurt.jpg" video="/posts/live-photos/yogurt.mp4" alt="酸奶" caption="酸奶的两秒钟" */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `src` | 必填 | 静态图。 |
| `video` | 必填 | 视频。 |
| `alt` | `""` | 静态图的替代文本。 |
| `caption` | — | 图注，支持 Markdown。 |
| `width`、`height` | 从文件读取 | 静态图的尺寸。 |
| `zoom` | `params.livePhoto.zoom` | `true` 让点击静态图时在查看器中打开。 |

- 悬停时静音播放视频，读者偏好减少动态效果时除外。长按或点 **LIVE** 会带声音播放。
- 视频在播放前不下载。没有 JavaScript 时只显示静态图。
- 实况照片总是单独放置，放进图集会让构建失败。

要让所有实况照片都能在查看器中打开，设置：

{{< code-toggle file="hugo" >}}
[params.livePhoto]
  zoom = true
{{< /code-toggle >}}

### 手机拍的实况照片 {#live-photo-phone}

iPhone 把实况照片存成一张 HEIC 图片加一段 MOV 视频，Android 手机的动态照片则是一个内嵌视频的 JPEG。[PicForge](https://picforge.de/) 可以在浏览器里把两者都转换成静态图加 MP4。

把两个文件都放进文章的页面包：

```markdown
{{</* live-photo src="still.jpg" video="motion.mp4" alt="…" */>}}
```

两个文件也都可以是远程网址。静态图像其他远程图片一样在构建时下载，视频播放时从原主机串流。

## 音乐 {#music}

单曲播放器，封面就是播放按钮。

{{< music src="/posts/audio-and-video/morning.m4a" title="吉诺佩蒂第一号" artist="Robin Alciatore" original="萨蒂" cover="/posts/audio-and-video/cover-morning.jpg" date="2008-01-21" >}}

```markdown
{{</* music src="/posts/audio-and-video/morning.m4a" title="吉诺佩蒂第一号" artist="Robin Alciatore" original="萨蒂" cover="/posts/audio-and-video/cover-morning.jpg" date="2008-01-21" */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `src` | 必填 | 音频文件。 |
| `title` | 文件名 | 曲名。 |
| `artist` | — | 演唱或演奏者。 |
| `cover` | 音符图标 | 封面图，裁成正方形。 |
| `original` | — | 原唱，显示为“原唱 …”。 |
| `date` | — | 录制日期，如 `2008-01-21` 或 `2008-01-21 18:30`。 |
| `device` | — | 录音设备。 |

页面上同一时间只有一个播放器发声：开始播放一个，其他的会暂停。

## 播放列表 {#playlist}

从数据文件读取的曲目列表。曲目依次播放，加载失败的会被跳过。

{{< playlist data="/posts/audio-and-video/playlist.yaml" label="钢琴小品" >}}

```markdown
{{</* playlist data="/posts/audio-and-video/playlist.yaml" label="钢琴小品" */>}}
```

```yaml {title="content/posts/audio-and-video/playlist.yaml"}
- title: 吉诺佩蒂第一号
  artist: Robin Alciatore
  src: morning.m4a
  cover: cover-morning.jpg
  date: 2008-01-21
  original: 萨蒂
- title: F 大调夜曲，作品 15 之 1
  artist: Luke Faulkner
  src: river.mp3
  cover: cover-river.jpg
  date: 2015-10-14
  original: 肖邦
- title: E 小调夜曲，作品 72 之 1
  artist: Peter Johnston
  src: wind.mp3
  date: 2014-08-13
  original: 肖邦
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `data` | 必填 | YAML、JSON 或 TOML 文件，查找方式与媒体路径相同。 |
| `label` | — | 列表的标题和无障碍名称。 |
| `sort` | `date` | `date` 让最新录制的排在前面，`none` 保持文件中的顺序。 |

数据文件是一个曲目列表，或一个带 `tracks` 列表的映射。每首曲目接受 [音乐](#music) 的参数，`src` 必填。文件里的路径从数据文件所在的页面包开始解析。

## 视频 {#video}

播放 MP4、WebM 等浏览器能直接播放的视频文件。

{{< video src="/posts/audio-and-video/clip.mp4" poster="/posts/audio-and-video/clip-poster.jpg" title="一段带封面的短片" >}}

```markdown
{{</* video src="/posts/audio-and-video/clip.mp4" poster="/posts/audio-and-video/clip-poster.jpg" title="一段带封面的短片" */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `src` | 必填 | 视频文件。 |
| `poster` | — | 封面图。 |
| `title` | — | 视频说明，也是无障碍名称。 |
| `ratio` | 封面的比例，或 `16/9` | 宽高比，如 `4/3`。不写时，视频加载后画框换成视频自身的比例。 |
| `preload` | `metadata` | `metadata`、`none` 或 `auto`。 |
| `autoplay` | `false` | 加载后自动播放，同时意味着 `muted`。 |
| `loop` | `false` | 播完从头再来。 |
| `muted` | `false` | 初始静音。 |

播放器获得焦点时，{{< kbd "K" >}} 或 {{< kbd "Space" >}} 播放和暂停，{{< kbd "M" >}} 静音，{{< kbd "F" >}} 切换全屏。

## YouTube {#youtube}

只在读者点击时才连接 Google 的 YouTube 嵌入。它取代 Hugo 内置的 `youtube`。

{{< youtube id="aqz-KE-bpKQ" title="Big Buck Bunny，Blender 基金会出品" start="30" >}}

```markdown
{{</* youtube id="aqz-KE-bpKQ" title="Big Buck Bunny，Blender 基金会出品" start="30" */>}}
```

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `id` | 必填 | 11 个字符的视频 id。 |
| `title` | — | 视频说明，也是无障碍名称。 |
| `start` | — | 开始时间，单位为秒。 |
| `end` | — | 结束时间，单位为秒。 |
| `poster` | YouTube 缩略图 | 自己的封面图。 |

- 缩略图在构建时下载，从你的站点提供。下载失败时，构建输出 `icy-remote-fetch` 警告，并显示一个朴素的封面。写上 `poster` 就不再依赖网络。
- 点击后，播放器从 `youtube-nocookie.com` 加载。连不上 YouTube 时，读者会看到重试按钮和直达链接。
- 没有 JavaScript 时，封面直接链接到 YouTube 上的视频。
- 只接受上面列出的参数。位置参数形式的 id 或 Hugo 的 `autoplay` 都会让构建失败。

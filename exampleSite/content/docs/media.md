+++
title = 'Media'
description = 'Images, galleries, live photos, audio and video.'
weight = 40
date = 2026-11-24
images = ['covers/media.webp']
+++

Icy reads image sizes at build time, adds responsive WebP versions and a blurred placeholder, and opens images in a built-in viewer. Audio and video players use the browser's own controls until JavaScript loads the theme's.

## Where files live {#sources}

Every media path, in a shortcode or a Markdown image, is looked up in this order:

1. The page bundle: `photo.jpg` next to the page's `index.md`.
2. `assets/`: `images/photo.jpg` for `assets/images/photo.jpg`.
3. Another page's bundle, by site path: `/posts/images-and-galleries/lake-boats.webp`.
4. `static/`, by site path: `/images/photo.jpg` for `static/images/photo.jpg`.
5. A remote URL.

A local path that matches nothing fails the build.

Images from the first three places get WebP versions from 480 to 2400 pixels wide and a placeholder. Images in `static/` only have their size read. SVG and GIF files are used as they are.

### Remote images {#remote-images}

Remote images are downloaded at build time, processed like local ones and served from your site. Readers never contact the original host. Remote audio and video are linked as they are.

If a download fails, the image links to its original URL without a size or placeholder, and the build logs an `icy-remote-fetch` warning: see [Network access](/docs/deployment/#network). So that the page doesn't shift even then, give remote images a size with `figure`:

```markdown
{{</* figure src="https://images.example.com/lake.jpg" alt="A lake at dawn" width="1600" height="1067" */>}}
```

## Markdown images {#images}

An image on a line of its own becomes a figure, with its title as the caption.

![Rowing boats on a turquoise mountain lake](/posts/images-and-galleries/lake-boats.webp "Boats waiting on a mountain lake")

```markdown
![Rowing boats on a turquoise mountain lake](/posts/images-and-galleries/lake-boats.webp "Boats waiting on a mountain lake")
```

If every image renders small and inline instead, add the Markdown settings from [Getting started](/docs/installation/#configure). A `{.class}` line after the image adds a class to the figure.

An image inside a sentence is drawn at text height, which suits stickers and emoji. Hovering or tapping it shows it larger, with its alt text, above the line. [Smoji](https://smoji.zsh.moe/) has ready-made sets to pick from.

The build passed ![Grinning face](/posts/images-and-galleries/grin.webp) so I went for coffee.

```markdown
The build passed ![Grinning face](/posts/images-and-galleries/grin.webp) so I went for coffee.
```

## Image viewer {#viewer}

Click an image to open it in the viewer. All images on a page form one sequence: try it on any photo here.

- Arrow keys, {{< kbd "Home" >}}, {{< kbd "End" >}} or a swipe move between images.
- {{< kbd "Esc" >}} or a click on the backdrop closes the viewer.
- Without JavaScript, a click opens the full-size file.

| Parameter | Default | Description |
| --- | --- | --- |
| `params.article.imageViewer` | `true` | `false` turns the viewer off site-wide. |

A single image opts out with `zoom=false` on its [figure](#figure). Linked images never open in the viewer. Live photos have their own setting: see [Live photos](#live-photo).

## Cover images {#covers}

An article shows a cover under its header. Icy takes the first entry of front matter `images`, or, when there is none, a bundle image whose name contains `cover` or `feature`.

{{< code-toggle fm=true >}}
title = 'A walk by the lake'
images = ['cover.jpg']
{{< /code-toggle >}}

| Parameter | Default | Description |
| --- | --- | --- |
| `params.article.cover` | `true` | `false` hides covers site-wide. |
| `hideCover` in front matter | `false` | `true` hides this page's cover. |

A remote URL in `images` is used for social previews only, not as a cover. Protected posts never show or share a cover.

## Figures {#figure}

One image with an optional title and caption, handled like a Markdown image. It replaces Hugo's built-in `figure`.

{{< figure src="/posts/images-and-galleries/yosemite-river.webp" alt="A river in Yosemite Valley at dawn, with cliffs in a pink haze" title="Yosemite Valley" caption="The caption supports **Markdown**." >}}

```markdown
{{</* figure src="/posts/images-and-galleries/yosemite-river.webp" alt="A river in Yosemite Valley at dawn, with cliffs in a pink haze" title="Yosemite Valley" caption="The caption supports **Markdown**." */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `src` | required | The image. |
| `alt` | `""` | Alternative text. |
| `title` | — | Bold title at the start of the caption. |
| `caption` | — | Caption. Markdown. |
| `link` | — | URL the image links to, instead of opening the viewer. |
| `align` | `center` | `left` or `right` puts a narrow image against that edge. Text doesn't wrap around it. |
| `class` | — | Extra class on the `<figure>`. |
| `width`, `height` | From the file | Required for SVG, recommended for remote images. |
| `zoom` | `params.article.imageViewer` | `false` keeps this image out of the viewer. |
| `zoomSrc` | `src` | A larger image for the viewer. |

## Galleries {#gallery}

Photos in justified rows: each row fills the width, and its photos share one height. The layout needs no JavaScript.

{{< gallery caption="Three places" >}}
  {{< gallery-item src="/posts/images-and-galleries/atitlan-path.webp" alt="A path through purple flowers to Lake Atitlán, with volcanoes under a violet sunset sky" >}}
  {{< gallery-item src="/posts/images-and-galleries/foggy-summit.webp" alt="Green cliffs and a winding road under drifting fog at sunrise" caption="Each photo can have a caption" >}}
  {{< gallery-item src="/posts/images-and-galleries/blue-ranges.webp" alt="Layers of blue mountain ridges fading into haze" >}}
{{< /gallery >}}

```markdown
{{</* gallery caption="Three places" */>}}
  {{</* gallery-item src="/posts/images-and-galleries/atitlan-path.webp" alt="A path through purple flowers to Lake Atitlán, with volcanoes under a violet sunset sky" */>}}
  {{</* gallery-item src="/posts/images-and-galleries/foggy-summit.webp" alt="Green cliffs and a winding road under drifting fog at sunrise" caption="Each photo can have a caption" */>}}
  {{</* gallery-item src="/posts/images-and-galleries/blue-ranges.webp" alt="Layers of blue mountain ridges fading into haze" */>}}
{{</* /gallery */>}}
```

`gallery`:

| Parameter | Default | Description |
| --- | --- | --- |
| `columns` | `auto` | Photos per row, `1` to `4`. `auto`: one row for one or two photos, two per row for four, otherwise three. |
| `caption` | — | Caption for the whole gallery. Markdown. |
| `label` | — | Accessible name when there is no caption. |

`gallery-item`, directly inside `gallery`:

| Parameter | Default | Description |
| --- | --- | --- |
| `src` | required | The image. |
| `alt` | `""` | Alternative text. |
| `caption` | — | Caption under the photo. Markdown. |
| `link` | — | URL the photo links to, instead of opening the viewer. |
| `width`, `height` | From the file | The photo's size. |
| `ratio` | — | Aspect ratio such as `4/3`, instead of a size. |
| `zoomSrc` | `src` | A larger image for the viewer. |
| `loading` | `lazy` | `lazy` or `eager`. |

The layout needs each photo's proportions. A photo whose size can't be read, such as an SVG or a remote image, needs `width` and `height` or `ratio`, or the build fails.

## Live photos {#live-photo}

A still photo paired with a short video, like a phone's Live Photo. Hover over it, long-press it, or press **LIVE**.

{{< live-photo src="/posts/live-photos/yogurt.jpg" video="/posts/live-photos/yogurt.mp4" alt="Yogurt, the cat" caption="Yogurt, two seconds of her" >}}

```markdown
{{</* live-photo src="/posts/live-photos/yogurt.jpg" video="/posts/live-photos/yogurt.mp4" alt="Yogurt, the cat" caption="Yogurt, two seconds of her" */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `src` | required | The still image. |
| `video` | required | The video. |
| `alt` | `""` | Alternative text for the still. |
| `caption` | — | Caption. Markdown. |
| `width`, `height` | From the file | The still's size. |
| `zoom` | `params.livePhoto.zoom` | `true` lets a click open the photo in the viewer, where it still plays. |

- Hovering plays the video muted, unless the reader prefers reduced motion. A long press or **LIVE** plays it with sound. On a phone, a long press plays the photo instead of opening the menu to save the image.
- Nothing of the video is downloaded until it plays. Without JavaScript only the still shows.
- A live photo stands on its own. Inside a gallery it fails the build.

To make every live photo open in the viewer, set:

{{< code-toggle file="hugo" >}}
[params.livePhoto]
  zoom = true
{{< /code-toggle >}}

### From a phone {#live-photo-phone}

iPhones save a Live Photo as a HEIC image and a MOV clip. Android phones save a motion photo as one JPEG with the video inside. [PicForge](https://picforge.de/) turns either into a still and an MP4 in your browser.

Put both files in the post's bundle:

```markdown
{{</* live-photo src="still.jpg" video="motion.mp4" alt="…" */>}}
```

Both can also be remote URLs. The still is then downloaded like any remote image, and the video streams from its host.

## Music {#music}

A single-track player. The cover is the play button.

{{< music src="/posts/audio-and-video/morning.m4a" title="Gymnopédie No. 1" artist="Robin Alciatore" original="Erik Satie" cover="/posts/audio-and-video/cover-morning.jpg" date="2008-01-21" >}}

```markdown
{{</* music src="/posts/audio-and-video/morning.m4a" title="Gymnopédie No. 1" artist="Robin Alciatore" original="Erik Satie" cover="/posts/audio-and-video/cover-morning.jpg" date="2008-01-21" */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `src` | required | The audio file. |
| `title` | File name | Track title. |
| `artist` | — | Performer. |
| `cover` | Music icon | Cover image, cropped to a square. |
| `original` | — | Original artist, shown as "Original by …". |
| `date` | — | Recording date, such as `2008-01-21` or `2008-01-21 18:30`. |
| `device` | — | Recording device. |

Only one player on a page sounds at a time: starting one pauses the others.

## Playlists {#playlist}

A track list read from a data file. Tracks play one after another, and broken ones are skipped.

{{< playlist data="/posts/audio-and-video/playlist-en.yaml" label="Piano pieces" >}}

```markdown
{{</* playlist data="/posts/audio-and-video/playlist-en.yaml" label="Piano pieces" */>}}
```

```yaml {title="content/posts/audio-and-video/playlist-en.yaml"}
- title: Gymnopédie No. 1
  artist: Robin Alciatore
  src: morning.m4a
  cover: cover-morning.jpg
  date: 2008-01-21
  original: Erik Satie
- title: Nocturne in F major, Op. 15 No. 1
  artist: Luke Faulkner
  src: river.mp3
  cover: cover-river.jpg
  date: 2015-10-14
  original: Frédéric Chopin
- title: Nocturne in E minor, Op. 72 No. 1
  artist: Peter Johnston
  src: wind.mp3
  date: 2014-08-13
  original: Frédéric Chopin
```

| Parameter | Default | Description |
| --- | --- | --- |
| `data` | required | A YAML, JSON or TOML file, found like any media path. |
| `label` | — | Heading and accessible name of the list. |
| `sort` | `date` | `date` lists the newest recordings first, `none` keeps the file order. |

The file is a list of tracks, or a map with a `tracks` list. Each track takes the [music](#music) parameters, and `src` is required. Paths in the file resolve from the bundle the file is in.

## Video {#video}

A player for MP4, WebM and other files the browser can play.

{{< video src="/posts/audio-and-video/clip.mp4" poster="/posts/audio-and-video/clip-poster.jpg" title="A short clip with a poster" >}}

```markdown
{{</* video src="/posts/audio-and-video/clip.mp4" poster="/posts/audio-and-video/clip-poster.jpg" title="A short clip with a poster" */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `src` | required | The video file. |
| `poster` | — | Poster image. |
| `title` | — | Caption, also the accessible name. |
| `ratio` | Poster's shape, or `16/9` | Aspect ratio such as `4/3`. Without it, the frame adopts the video's shape once it loads. |
| `preload` | `metadata` | `metadata`, `none` or `auto`. |
| `autoplay` | `false` | Play on load. Implies `muted`. |
| `loop` | `false` | Start again at the end. |
| `muted` | `false` | Start muted. |

With the player focused, {{< kbd "K" >}} or {{< kbd "Space" >}} plays and pauses, {{< kbd "M" >}} mutes and {{< kbd "F" >}} toggles full screen.

## YouTube {#youtube}

A YouTube embed that contacts Google only when the reader clicks. It replaces Hugo's built-in `youtube`.

{{< youtube id="aqz-KE-bpKQ" title="Big Buck Bunny, by the Blender Foundation" start="30" >}}

```markdown
{{</* youtube id="aqz-KE-bpKQ" title="Big Buck Bunny, by the Blender Foundation" start="30" */>}}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `id` | required | The 11-character video id. |
| `title` | — | Caption, also the accessible name. |
| `start` | — | Start time in seconds. |
| `end` | — | End time in seconds. |
| `poster` | YouTube's thumbnail | Your own poster image. |

- The thumbnail is downloaded at build time and served from your site. If that fails, the build logs an `icy-remote-fetch` warning and shows a plain poster. Set `poster` to avoid depending on the network.
- On click, the player loads from `youtube-nocookie.com`. If YouTube can't be reached, readers get a Retry button and a direct link.
- Without JavaScript, the poster links to the video on YouTube.
- Only the parameters above are accepted. A positional id or Hugo's `autoplay` fails the build.

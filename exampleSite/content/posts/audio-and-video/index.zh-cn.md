+++
title = '音频与视频'
date = 2026-11-05T10:00:00+08:00
images = ['covers/audio-and-video.webp']
description = '几段钢琴录音、一个播放列表、太空中看到的极光和一部 YouTube 短片。'
tags = ['音频', '视频', '媒体', '短代码']
categories = ['示例']
+++

这些播放器的写法见 [媒体](/docs/media/) 文档。

安静的晚上听点钢琴，再看几段视频。同一时间只会播放一个。

## 音乐

{{< music src="morning.m4a" title="吉诺佩蒂第一号" artist="Robin Alciatore" original="萨蒂" cover="cover-morning.jpg" date="2008-01-21" >}}

{{< music src="wind.mp3" title="E 小调夜曲，作品 72 之 1" artist="Peter Johnston" original="肖邦" >}}

还有一段刚从录音笔里导出来、还没起名字的：

{{< music src="river.mp3" >}}

## 播放列表

{{< playlist data="playlist.yaml" label="三段钢琴录音" >}}

## 视频

{{< video src="clip.mp4" poster="clip-poster.jpg" title="从国际空间站看到的南极光" >}}

同一段视频，做成无声循环：

{{< video src="clip.mp4" autoplay=true loop=true title="循环播放的极光" >}}

再来一次，按下播放后才开始下载：

{{< video src="clip.mp4" preload="none" ratio="16/9" title="按需加载的极光" >}}

## YouTube

按下播放之前，页面不会从 YouTube 加载任何东西。

{{< youtube id="aqz-KE-bpKQ" title="Big Buck Bunny，Blender 基金会出品" >}}

{{< youtube id="aqz-KE-bpKQ" title="Big Buck Bunny，1:00 到 1:30" start="60" end="90" poster="clip-poster.jpg" >}}

## 素材来源

音频是 Wikimedia Commons 上 [Musopen](https://musopen.org/) 录音的短片段，视频是 NASA 影片的片段。

- 《吉诺佩蒂第一号》（萨蒂），Robin Alciatore 演奏：[来源](https://commons.wikimedia.org/wiki/File:Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg)，[公有领域](https://creativecommons.org/publicdomain/mark/1.0/)
- 《F 大调夜曲，作品 15 之 1》（肖邦），Luke Faulkner 演奏：[来源](https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_Op._15_no._1_in_F_major.ogg)，[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- 《E 小调夜曲，作品 72 之 1》（肖邦），Peter Johnston 演奏：[来源](https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_in_Em,_Op._posth._72.ogg)，[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- 《Aurora Australis as seen from ISS》，NASA Scientific Visualization Studio：[来源](https://svs.gsfc.nasa.gov/31281)，公有领域
- 曲目封面：[Unsplash](https://unsplash.com/)，[Unsplash License](https://unsplash.com/license)

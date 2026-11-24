+++
title = 'Audio and video'
date = 2026-11-05T10:00:00+08:00
images = ['covers/audio-and-video.webp']
description = 'Piano recordings, a playlist, the aurora from space and a YouTube film.'
tags = ['Audio', 'Video', 'Media', 'Shortcodes']
categories = ['Examples']
+++

How to add these: [Media](/docs/media/).

Some piano for a quiet evening, and a few things to watch. Only one plays at a time.

## Music

{{< music src="morning.m4a" title="Gymnopédie No. 1" artist="Robin Alciatore" original="Erik Satie" cover="cover-morning.jpg" date="2008-01-21" >}}

{{< music src="wind.mp3" title="Nocturne in E minor, Op. 72 No. 1" artist="Peter Johnston" original="Frédéric Chopin" >}}

And one straight from the recorder, still without a name:

{{< music src="river.mp3" >}}

## A playlist

{{< playlist data="playlist-en.yaml" label="Three piano recordings" >}}

## Video

{{< video src="clip.mp4" poster="clip-poster.jpg" title="Aurora australis, seen from the International Space Station" >}}

The same clip as a silent loop:

{{< video src="clip.mp4" autoplay=true loop=true title="The aurora, on a loop" >}}

And once more, downloaded only when you press play:

{{< video src="clip.mp4" preload="none" ratio="16/9" title="The aurora, loaded on demand" >}}

## YouTube

Nothing is loaded from YouTube until you press play.

{{< youtube id="aqz-KE-bpKQ" title="Big Buck Bunny, by the Blender Foundation" >}}

{{< youtube id="aqz-KE-bpKQ" title="Big Buck Bunny, 1:00 to 1:30" start="60" end="90" poster="clip-poster.jpg" >}}

## Credits

The recordings are short excerpts from [Musopen](https://musopen.org/) recordings on Wikimedia Commons; the video is a NASA excerpt.

- *Gymnopédie No. 1* (Satie), played by Robin Alciatore: [source](https://commons.wikimedia.org/wiki/File:Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg), [public domain](https://creativecommons.org/publicdomain/mark/1.0/)
- *Nocturne in F major, Op. 15 No. 1* (Chopin), played by Luke Faulkner: [source](https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_Op._15_no._1_in_F_major.ogg), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- *Nocturne in E minor, Op. 72 No. 1* (Chopin), played by Peter Johnston: [source](https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_in_Em,_Op._posth._72.ogg), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- *Aurora Australis as seen from ISS*, NASA Scientific Visualization Studio: [source](https://svs.gsfc.nasa.gov/31281), public domain
- Track covers: [Unsplash](https://unsplash.com/), [Unsplash License](https://unsplash.com/license)

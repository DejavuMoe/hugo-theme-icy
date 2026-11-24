+++
title = '加密文章示例'
date = 2026-11-02T10:00:00+08:00
description = '一篇受密码保护的文章，在你的浏览器里解密。'
tags = ['安全']
categories = ['示例']
[protected]
  enabled = true
  password = 'icy'
  hint = '主题的名字（小写）'
+++

写法见 [受保护文章](/docs/protected-posts/) 文档。

你找到了入口。标题以下的所有内容都在构建后被加密，刚刚才在你的浏览器里解密，密码从未离开浏览器。

照片同样是加密的：

![紫色花丛间的小路通向阿蒂特兰湖，远处是火山和紫色晚霞](atitlan-path.webp "刚刚解密")

{{< gallery caption="画廊同样是当场解密的" >}}
  {{< gallery-item src="waterfall-bridge.webp" alt="绿色峡谷里，高高的瀑布从一座石桥后落下" >}}
  {{< gallery-item src="orange-flowers.webp" alt="淡色天空下，草丛上方的橙色虞美人" >}}
{{< /gallery >}}

{{< live-photo src="yogurt.jpg" video="yogurt.mp4" alt="酸奶" caption="酸奶也藏了个秘密" >}}

其他功能和普通页面一样可用：

```js {title="secret.js"}
console.log("只有知道密码的人才能看到");
```

{{< details summary="一个折叠块" >}}
解锁之后照样可以展开和收起。
{{< /details >}}

还有一个脚注，把鼠标移上去看看[^note]。

[^note]: 这条脚注也在密文里。

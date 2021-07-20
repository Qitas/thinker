---
title: "博文聚合站-rssblog"
slug: "rss-rssblog"
date: 2021-07-19T20:51:20+08:00
lastmod: 2021-07-19T20:51:20+08:00
author: bbing
draft: false
tags: ["RSS", "vercel", "flask"]
categories: ["工具"]
weight: 1
---

## [RSSBlog](https://rssblog.cn/)

[RSSBlog](https://rssblog.cn/) 是一个基于RSS的博客内容聚合站. 想法来源: [https://github.com/volfclub/travellings](https://github.com/volfclub/travellings) 及 [https://front-end-rss.vercel.app/](https://front-end-rss.vercel.app/)

通过[RSSBlog](https://rssblog.cn/)将方便地预览不同博客的标题, 而无需进入不同的博客浏览. [RSSBlog](https://rssblog.cn/)使用时间戳排序, 越新的文章将排列在越前.

### 接入规则

#### 加入[RSSBlog](https://rssblog.cn/)的博客应满足

1. 愿为开放的网络做出贡献(如乐于分享知识经验等)
2. 没有违法以及影响体验的内容(如侵入式广告等)
3. 正常更新维护中(国内无法正常访问会被移除)
4. 网页已有较多内容
5. 启用https

#### 提交issue

如果满足[RSSBlog](https://rssblog.cn/)的接入条件, 且期望接入[RSSBlog](https://rssblog.cn/), 需要按照以下格式提交[issue](https://github.com/caibingcheng/rssblog/issues):
```
{
    link: 'https://yourblog.com/rss.xml',
    author: 'yourname'
}
```
提交的[issue](https://github.com/caibingcheng/rssblog/issues)将经过人工筛选, 以保证内容干净.

或者直接修改[rss.py](https://github.com/caibingcheng/rssblog/blob/master/utils/rss.py)的PR.

#### RSS接力

目前还没有非常确定的定义[RSSBlog](https://rssblog.cn/)的接力规则, 所以目前可以您的博客网站中无需有指向[RSSBlog](https://rssblog.cn/)的链接, 当然有的话最好了.

您可以在底部或者其他地方接入:
```HTML
<a href="https://rssblog.cn/" target="_blank" rel="noopener" title="RSSBlog">
    <i class='fas fa-fw fa-inbox'></i>RSSBlog
</a>
```
```fa-inbox```看起来像一个盒子, 比较贴近RSS聚合的定义.

有任何问题或者建议欢迎提[issue](https://github.com/caibingcheng/rssblog/issues).
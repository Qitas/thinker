---
title: "tmux插件-保存会话"
slug: "tmux-plugin-ssesion"
date: 2021-06-21T10:07:38+08:00
lastmod: 2021-06-21T10:07:38+08:00
author: bbing
draft: false
tags: ["tmux", "插件", "短文"]
categories: ["工具"]
---

## 下载插件
```Shell
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
git clone https://github.com/tmux-plugins/tmux-resurrect ~/.tmux/plugins/tmux-resurrect
git clone https://github.com/tmux-plugins/tmux-continuum ~/.tmux/plugins/tmux-continuum
```

## 配置文件
在```~/.tmux.conf```添加:
```Shell
# plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @continuum-save-interval '15'
set -g @continuum-restore 'on'
set -g @resurrect-capture-pane-contents 'on'

run -b '~/.tmux/plugins/tpm/tpm'
```

## 重新加载
按照个人配置不同, 前缀可能有差异.
```Shell
Ctrl+b r
```

## 手动保存和加载
```Shell
Ctrl+b Ctrl+s ## 保存
Ctrl+b Ctrl+r ## 加载
```
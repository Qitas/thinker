---
title: "初探Linux文件和文件系统"
slug: "linux-filesystem"
date: 2021-05-12T14:47:09+08:00
lastmod: 2021-05-11T19:09:31+08:00
author: bbing
draft: true
tags: ["Linux", "文件系统"]
categories: ["操作系统"]
---

前面的文章讲了进程控制和进程通信的内容, 在学习和准备这些内容的过程中, 发现对Linux文件系统并不是很熟悉. 此前对Linux文件系统的理解非常肤浅, 嘴上会说"万物皆是文件"的话, 但是并不是很理解Linux的文件系统. 这里插入一篇文章, 学习和整理一下Linux文件系统的内容.

<!--more-->

## 文件

### ls

在Linux上可以使用ls命令查看对应路径下的文件, 比如ls -la查看当前路径下的文件:
```
drwxrwxr-x 3 mi mi 4096 4月  27 19:32 .
drwxrwxr-x 7 mi mi 4096 4月  26 10:02 ..
-rw-rw-r-- 1 mi mi    0 4月  26 10:03 file_attr
drwxrwxr-x 2 mi mi 4096 4月  27 19:32 file_dic
```
每一行代表一个文件或者一个目录, 一行大概可以分成七块区域, 以文件file_attr为例: ```-rw-rw-r--```, ```1```, ```mi```, ```mi```, ```0```, ```4月  26 10:03```, ```file_attr```.

首先可以理解, ```4月  26 10:03```, ```file_attr```代表的是时间和文件名, 且时间是在每次写入文件时才会改变, 打开文件时这个时间是不变的, 所以这里的时间就是最后修改的时间. 其他的部分是什么意思呢?

```-rw-rw-r--```代表文件的权限, 在Linux系统中, 一切操作都有比较严格的权限控制, 对一个文件来说, 它可以读/写/执行, 所以Linux使用```rwx```三个字符分别表示文件的读写和执行权限, 实际上是一个mask, 用3bits表示, 从高到底分别是读写和执行, 所以可以用7表示读写执行权限, 6表示读写权限, 1表示执行权限等等. 针对当前用户, 当前用户组, 其他用户组可以设置不同的读/写/执行权限.

数字```1```则表示有几个文件link了这个文件, 表示的是硬链接. ```mi mi```两项代表这个文件的拥有者和拥有者的用户组. 数字```0```则代表文件内容的大小, 因为没有向文件中添加内容, 所以大小为0.

注意到当前目录表示```.```和上一级目录表示```..```都被ls打印出来了, 其是这两种目录都是文件. 在Linux中目录和文件都被当做文件, 只是属于不同的文件类型.

### 文件权限

普通文件的文件权限比较好理解, 这里就不再验证了. 目录文件的文件权限如何理解呢?

对某个目录./filesystem/, 向关闭所有权限:
```
chmod 000 ./filesystem/
```
这时候再查看就会报错:
```
$ ls ./filesystem/
ls: cannot open directory './filesystem/': Permission denied
```
添加读写权限:
```
chmod 600 ./filesystem/
```
这时候再查看依然会有一些错误:
```
$ ls  ./filesystem/
ls: cannot access './filesystem/file_attr': Permission denied
ls: cannot access './filesystem/file_dic': Permission denied
file_attr  file_dic
```
列举除了目录下的文件, 但是对目录下的文件没有访问权限(为什么要)


### stat

可以使用stat查看文件的详细信息:
```
$ stat .
  File: .
  Size: 4096            Blocks: 8          IO Block: 4096   directory
Device: 802h/2050d      Inode: 136185988   Links: 3
Access: (0775/drwxrwxr-x)  Uid: ( 1000/      mi)   Gid: ( 1000/      mi)
Access: 2021-05-11 20:36:13.625994262 +0800
Modify: 2021-05-11 20:36:12.533997328 +0800
Change: 2021-05-11 20:36:12.533997328 +0800
 Birth: -
```
首先我们查看当前目录
```
$ stat ./file_attr
  File: ./file_attr
  Size: 0               Blocks: 0          IO Block: 4096   regular empty file
Device: 802h/2050d      Inode: 136185989   Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/      mi)   Gid: ( 1000/      mi)
Access: 2021-05-12 13:04:02.996823303 +0800
Modify: 2021-05-08 20:32:55.623371621 +0800
Change: 2021-05-08 20:32:55.623371621 +0800
 Birth: -
```

### df

### inode

> 前面的文章说过: Linux管道是一个文件, 但是没有具体的文件内容, 在struct inode中就可以看到inode会有一个成员指向pipe_inode_info.

## 文件系统

### inode

### block

### super_block

> 问题: 文件是怎么储存在磁盘上, 又是如何加载进内存的?

如果让我们自己设计磁盘存储文件的方式, 可能会想到两种:

1. 文件存储在磁盘连续的空间上;
2. 文件分片存储在磁盘连续的空间上;

如果是第一种存储方式, 那么可能会遇到一些问题, 比如磁盘上存储了很多很小的文件, 假设只有1KB, 之后我们删除其中的一些文件, 那么在磁盘上就会有很多坑坑洼洼的小碎片, 如果这时候我们要存储一个比较大文件, 但是没有连续的空间了, 该怎么办呢?  这时候我们可以"整理"一下磁盘, 把分散的文件移动到一起, 这样就会有大的连续的存储空间了. 但是, 这样必然会设计大量的搬运操作, 大大提高系统功耗, 降低系统的效率, 且容易损坏磁盘.

第二种方式这是类比链表(或者类比内存RAM), 将磁盘分成很多很多的小块, 比如每块只有1KB, 那么文件就存储在这些小块上. 比如, 文件小于1KB, 则一块空间就行了, 文件大于1KB, 则每1KB都存储在一小块空间上. 相比于第一种方法, 第二种方法原生地就把磁盘分割成了很多小块, 就算有超大文件需要存储也用担心有没有足够大小的连续空间的问题. 但是第二种方法就需要存储每个小块的地址, 并且需要直到小块的顺序关系, 而第一种方法一般只需要存储一个地址和文件大小就行了.

Linux上一般使用的是第二种存储方式.

## 遗留问题(TODO)

1. 查看根目录inode信息, 有几项特殊的内容:
```Shell
ls -ia /
2 .  2 ..  2 dev  2 run
1 proc  1 sys
```
```.``` ```..``` ```dev```和```run```的inode id相同;
```proc```和```sys```的inode id相同;
为什么他们的inode id相同但是内容会不同?

## 参考链接
1. [Linux中的任务和调度[一]](https://zhuanlan.zhihu.com/p/100030111)
2. [Linux的进程地址空间[一]](https://zhuanlan.zhihu.com/p/66794639)
3. [If threads share the same PID, how can they be identified?](https://stackoverflow.com/questions/9305992/if-threads-share-the-same-pid-how-can-they-be-identified)
4. [从内核角度看Linux 线程和进程的区别](https://blog.csdn.net/qq_28351465/article/details/88950311)
5. [linux/include/linux/fs.h](https://code.woboq.org/linux/linux/include/linux/fs.h.html#inode)

> 通过阅读源码, 一点一点深挖.
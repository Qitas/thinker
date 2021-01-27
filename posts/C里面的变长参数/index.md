---
title: "C里面的变长参数"
slug: ""
date: 2021-01-27T17:26:46+08:00
lastmod:  2021-01-27T17:26:46+08:00
author: bbing
draft: false
tags: ["Cpp", "模板"]
categories: ["代码"]
---

## stdarg.h
这里用到的是```stdarg.h```这个库, 可以在C语言里面实现可变长参数.

> 当然C++会简单得多, C++11之后的模板原生支持可变长参数.

几个函数va_list、va_start、va_arg、va_end，定义在stdarg.h

先需要理解C/C++函数入参的顺序，对一个函数，入参按照从右往左的顺序。
```
void test(char *para1，char *param2，char *param3, char *param4)
{
      va_list list;
      ......
      return;
}
```

![C函数内存结构](https://s3.ax1x.com/2021/01/27/szVlCT.jpg "C函数内存结构")

## 内存对齐
源码头文件中，注意一下这个宏，内存对齐作用 [看这里](https://www.cnblogs.com/cpoint/p/3369456.html)：

```
#define __va_rounded_size(TYPE)  \
  (((sizeof (TYPE) + sizeof (int) - 1) / sizeof (int)) * sizeof (int))
```

1. TYPE size >= 4，偏移量=(sizeof(TYPE) / 4) * 4
2. TYPE size < 4, 偏移量=4

所以是按4Byte，32位对齐。

## va_list
```
typedef char *va_list;
```
这是一个适用于 va_start()、va_arg() 和 va_end() 这三个宏存储信息的类型。

## va_start
如下，LASTARG是最后一个传递给函数的已知的固定参数，即省略号之前的参数。
```
#ifndef __sparc__
#define va_start(AP, LASTARG)                                           \
 (AP = ((char *) &(LASTARG) + __va_rounded_size (LASTARG)))
#else
#define va_start(AP, LASTARG)                                           \
 (__builtin_saveregs (),                                                \
  AP = ((char *) &(LASTARG) + __va_rounded_size (LASTARG)))
#endif
```

## va_arg
这个宏检索函数参数列表中类型为TYPE 的下一个参数。
```
#define va_arg(AP, TYPE)                                                \
 (AP += __va_rounded_size (TYPE),                                       \
  *((TYPE *) (AP - __va_rounded_size (TYPE))))
```

## va_end
这个宏允许使用了 va_start 宏的带有可变参数的函数返回。如果在从函数返回之前没有调用 va_end，则结果为未定义。
```
#define va_end(AP)
//有些代码中定义为
#define va_end(ap)      ( ap = (va_list)0 )
```

## 用例
```
int sum(int count, ...)
{
    va_list vl;
    int sum = 0;
    va_start(vl, count);
    for (int i = 0; i < count; ++i)
    {
        sum += va_arg(vl, int);
    }
    va_end(vl);
    return sum;
}
```

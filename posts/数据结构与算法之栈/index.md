---
title: "数据结构与算法之栈"
date: 2021-01-15T11:09:30+08:00
lastmod:  2021-01-15T11:09:30+08:00
author: bbing
draft: true
tags: ["Cpp", "栈"]
categories: ["代码", "数据结构与算法"]
---

## 什么是栈

栈是一种数据结构, 满足先入后出.

一般栈支持以下几个操作:

```C++
push(n);    //数据入栈
a.pop();    //数据出栈
a.top();    //获取栈顶元素
a.size();   //获取栈中元素数量
a.empty();  //是否是空栈
```

## C++中的stack容器

[官方文档](https://en.cppreference.com/w/cpp/container/stack)中, 定义如下

```C++
template<
    class T,
    class Container = std::deque<T>
> class stack;
```

std::stack是一个C++模板类, 有两个模板参数T和Container, T代表容器元素的数据类型, Container则代表stack使用的容器, 默认使用std::deque这个容器. 这意味着, stack相当于是对已有容器的改装, 也可以使用用户自定义的容器.

Container必须提供以下几种方法:

1. 支持back();
2. 支持pop_back();
3. 支持push_back();

相当于都是往Container的后面塞入或者弹出数据, 也就是Container也需要满足的stack的基本功能.

因此, 我们将自定义或者其他C++标准容器转换为stack容器. 以下是官方的demo, 我添加了vector的转换以加强理解.

```C++
#include <stack>
#include <deque>
#include <vector>
#include <iostream>

int main()
{
    std::stack<int> c1;
    c1.push(5);
    std::cout << c1.size() << '\n';

    std::stack<int> c2(c1);
    std::cout << c2.size() << '\n';

    std::deque<int> deq {3, 1, 4, 1, 5};
    std::stack<int> c3(deq);                //stack的Container默认就是deque, 所以无需再次声明
    std::cout << c3.size() << '\n';

    // int ds[3] = {1, 2, 3};               //使用数组是不行的, 因为普通数组没有实现Container要求的操作
    std::vector<int> ds {1, 2, 3};
    std::stack<int, std::vector<int>> c4(ds);   //vector不是stack默认的Container类型, 所以需要声明
    std::cout << c4.size() << '\n';
}
```

## 括号匹配问题


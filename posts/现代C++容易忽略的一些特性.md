---
title: "现代C++容易忽略的一些特性"
slug: "cpp-modern-feature"
date: 2021-07-30T19:47:25+08:00
lastmod: 2021-07-30T19:47:25+08:00
author: bbing
draft: false
tags: ["Cpp"]
categories: ["代码", "Cpp"]
---

持续更新中...主要来源[在这里](https://changkun.de/modern-cpp/)

#### if/switch 变量声明强化[C++17]

C++17 使得我们可以在 if（或 switch）中使用局部变量:
```C++
// 将临时变量放到 if 语句内
if (const std::vector<int>::iterator itr = std::find(vec.begin(), vec.end(), 3);
    itr != vec.end()) {
    *itr = 4;
}
```

<!--more-->


#### 初始化列表[C++11]

C++11 首先把初始化列表的概念绑定到了类型上，并将其称之为```std::initializer_list```，允许构造函数或其他函数像参数一样使用初始化列表，这就为类对象的初始化与普通数组和 POD 的初始化方法提供了统一的桥梁，例如：
```C++
#include <initializer_list>
#include <vector>
class MagicFoo {
public:
    std::vector<int> vec;
    MagicFoo(std::initializer_list<int> list) {
        for (std::initializer_list<int>::iterator it = list.begin();
             it != list.end(); ++it)
            vec.push_back(*it);
    }
};
int main() {
    // after C++11
    MagicFoo magicFoo = {1, 2, 3, 4, 5};

    std::cout << "magicFoo: ";
    for (std::vector<int>::iterator it = magicFoo.vec.begin(); it != magicFoo.vec.end(); ++it) std::cout << *it << std::endl;
}
```
初始化列表除了用在对象构造上，还能将其作为普通函数的形参，例如：
```C++
public:
    void foo(std::initializer_list<int> list) {
            for (std::initializer_list<int>::iterator it = list.begin(); it != list.end(); ++it) vec.push_back(*it);
    }

magicFoo.foo({6,7,8,9});
```
其次，C++11 还提供了统一的语法来初始化任意的对象，例如：
```C++
Foo foo2 {3, 4};
```

```std::initializer_list```和```std::vector```区别: ```std::initializer_list```一般是在栈上的, 不可修改, ```std::vector```在堆上, [详细](https://www.jianshu.com/p/3d69ff89a0c9)



#### 结构化绑定[C++17]

```C++
#include <iostream>
#include <tuple>

std::tuple<int, double, std::string> f() {
    return std::make_tuple(1, 2.3, "456");
}

int main() {
    auto [x, y, z] = f();
    std::cout << x << ", " << y << ", " << z << std::endl;
    return 0;
}
```



#### 返回值推导[C++14]

**不用后缀decltype了**.  C++14 开始是可以直接让普通函数具备返回值推导:

```C++
template<typename T, typename U>
auto add3(T x, U y){
    return x + y;
}
```



#### 外部模板[C++11]

在没有外部模板时可能会产生多个相同的实例, 带来冗余. 外部模板允许只有一个实例化了.

```C++
template class std::vector<bool>;          // 强行实例化
extern template class std::vector<double>; // 不在该当前编译文件中实例化模板
```



#### 类型别名模板[C++11]

使用```using```完全代替```typedef```.

```C++
typedef int (*process)(void *);
using NewProcess = int(*)(void *);
template<typename T>
using TrueDarkMagic = MagicType<std::vector<T>, std::string>;

int main() {
    TrueDarkMagic<bool> you;
}
```



#### 折叠表达式[C++17]

```C++
#include <iostream>
template<typename ... T>
auto sum(T ... t) {
    return (t + ...);
}
int main() {
    std::cout << sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10) << std::endl;
}
```



#### 非类型模板推导auto[C++17]

```C++
template <auto value> void foo() {
    std::cout << value << std::endl;
    return;
}

int main() {
    foo<10>();  // value 被推导为 int 类型
}
```



#### 委托构造[C++11]

```C++
#include <iostream>
class Base {
public:
    int value1;
    int value2;
    Base() {
        value1 = 1;
    }
    Base(int value) : Base() { // 委托 Base() 构造函数
        value2 = value;
    }
};

int main() {
    Base b(2);
    std::cout << b.value1 << std::endl;
    std::cout << b.value2 << std::endl;
}
```



#### 继承构造[C++11]

```C++
#include <iostream>
class Base {
public:
    int value1;
    int value2;
    Base() {
        value1 = 1;
    }
    Base(int value) : Base() { // 委托 Base() 构造函数
        value2 = value;
    }
};
class Subclass : public Base {
public:
    using Base::Base; // 继承构造
};
int main() {
    Subclass s(3);
    std::cout << s.value1 << std::endl;
    std::cout << s.value2 << std::endl;
}
```


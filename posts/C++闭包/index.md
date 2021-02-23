---
title: "C++闭包"
slug: "cpp-closure"
date: 2021-02-23T10:00:57+08:00
lastmod: 2021-02-23T16:10:18+08:00
author: bbing
draft: false
tags: ["Cpp", "C++11"]
categories: ["代码", "C++"]
---

## C++闭包

在一些现代对高级语言, 比如Python或者JavaScript中, 经常会提到闭包的概念, 但是在C++里面很少会听说闭包的概念.

C++可以实现闭包吗? 可以.

> 闭包函数: 可以理解为函数里面定义的函数;

> 闭包: 可以理解为闭包函数可以访问到外层函数的变量, 即使外层函数已经返回.

这一点可能不是很好理解, 先来看一个例子:
```C++
int main()
{
    auto add = [] (const int& a) {
        int b = a * a;
        cout << "call f1 " << b << endl;
        return [b] (const int &c) {
            int d = b + c;
            cout << "call f2 " << d << endl;
            return d;
        };
    };

    auto add_2 = add(2);
    cout << "------------" << endl;
    auto add_2_3 = add_2(3);

    return 1;
}
```

定义一个```add```函数, 作用是$f(x, y) = x * x + y$;

```add_2```获取了外层函数, 外层函数有局部变量```b```, $b = a * a$, 存储了入参2的初步计算结果, 返回值是另外一个匿名函数;

```add_2_3```相当于获取了外层函数的局部变量```b```, 同时也获取了内层函数对返回值.

所以, 上述输出会是:
```
call f1 4
------------
call f2 7
```

也可以这样调用:
```C++
auto add_2 = add(2);
add_2(3); //7
add_2(4); //8
```
上述的调用方法会让```add_2```看起来和```int add_2 = 2```之类的定义很像.(就像是一个普通的变量)

或者:
```C++
add(2)(3);  //7
add(4)(5);  //13
```

## lambda表达式

> 一般形式: [捕获变量] (形参) {语句};

### 捕获变量

一般我们可以用=和&来捕获所有变量, =代表值捕获, &代表应用捕获;

或者, 可以是某个具体的参数, 如果直接使用参数, 就是值捕获, 如果是参数前带&就是引用捕获;

再或者, 可以是一条语句, 比如```[&, sum = cal_sum()]() {//...}```.

我们来看一个例子:
```C++
int num = 1;
[num](){
    num = 2;
    cout << num << endl;
}();
cout << num << endl;
```
会编译失败, 提示:
```
<source>:36:13: error: assignment of read-only variable 'num'
```
因为lambda模式是const的, 不可修改捕获变量.(可以理解成类中的const成员函数, 捕获变量则理解为成员变量)

我们可以加一个mutable声明, 同类一样, 加上mutable声明后, 就可以在const成员函数中修改成员变量了, 相当于明确告诉编译器, 我非常明确知道我接下来的操作会有什么影响, 你不用优化了.
```C++
int num = 1;
[num]() mutable {
    num = 2;
    cout << num << endl;
}();
cout << num << endl;
```
输出是:
```
2
1
```
这里和预期是相符的, 因为我们使用的是值捕获, 如果改成引用捕获就会输出:
```
2
2
```

引用捕获可以减少拷贝行为, 但是**无脑使用引用捕获也会引起一些问题**.
```C++
auto add = [] (const int& a) {
    int c = a * a;
    return [&c] (const int &b) {
        return c + b;
    };
};
cout << add(1)(2) << endl;
```
在我的编译环境下, 这段代码对输出是32769, 是意料之外的, 预期输出应该是3.

问题在于使用了引用捕获, 在```add(1)```调用外层函数的之后, ```int c = a * a;```作为局部变量已经被释放了, 所以调用```add(1)(2)```会出现引用错误.

正确做法是使用值捕获, 会拷贝一次, 但是不管怎样拷贝的值是我们想要的, 不会引起错误.

### 形参

用到lambda会想到一个问题, 能不能像模板函数一样呢? 可以的.

比如实现加法计算, 可以如下定义:
```C++
auto add = [] (auto a, auto b) {
    return a + b;
};
cout << add(1, 2.2) << endl;
```
如果是模板实现, 则要麻烦得多:
```C++
template<typename T>
auto add(T a, T b)
{
    return a + b;
}
//...
cout << add(1, 2.2) << endl;
```
调用```add(1, 2.2)```是会报错的, 因为入参2.2时```T```推导时```double```, 入参1时推导是```int```, 找不到匹配函数. 得定义两个模板类型:
```
template<typename T1, typename T2>
auto add(T1 a, T2 b)
{
    return a + b;
}
```
很明显, 使用lambda和```auto```会简单一些.

### 一般性用法

#### 代码片段打包

一般性, 可以将lambda用于打包小段功能代码, 比如重复性的log:
```C++
const auto stat_log = [=](const int &index, const PROCESSSTAT &process_stat) {
    logi("processing index[{}] stat {} next {}, ret {}", index,
        statStr(process_stat).c_str(), statStr(getCurrentStat()).c_str(),
        statStr(m_algo_ret).c_str());
};
```
在需要调用对地方, 只需要调用```stat_log```函数就行了:
```C++
stat_log(index, PROCESSSTAT::PROCESSRUN);
stat_log(index, PROCESSSTAT::PROCESSERROR);
```
相较于非lambda情况, 我们**不再需要在外部定义一个函数, 减少了接口暴露的问题**.

#### 作为入参

在以往, 实现回调功能需要使用函数指针实现, 但是C++11之后可以使用function对象.

lambda表达式是一个function对象, 我们可以将其作为函数对入参. 比如```sort```函数:
```C++
int main()
{
    vector<int> v{4, 3, 1, 2};
    sort(v.begin(), v.end());
    for_each(v.begin(), v.end(), [](const int& a){
        cout << a << endl;
    });
}
```
默认是按照递增排序, 如果需要递减, 则:
```C++
sort(v.begin(), v.end(), greater<int>());
```

或者, 我们也可以实现自己定义的排序规则, 比如:
```C++
sort(v.begin(), v.end(), [](const int& a, const int& b){
    return a < b;
});
```
自定义排序函数, 在对一些复杂结构(如struct)排序时很有用, 我们可以指定排序的参考key.

再看这一段:
```C++
for_each(v.begin(), v.end(), [](const int& a){
    cout << a << endl;
});
```
借用```for_each```遍历, 使用lambda表达式, 我们可以实现很多不同的功能, 仅仅修改表达式的内容即可.

比如实现四则运算:
```C++
unordered_map<char, function<int(const int&, const int&)>> cal{
    {'+',   [](const int& a, const int& b){
                return a + b;
            }
    },
    //...
};
cout << cal['+'](1, 2) << endl;
```
---
title: "数据结构与算法之二叉树的遍历"
slug: "salgo-bintree-list"
date: 2021-02-01T11:21:01+08:00
lastmod:  2021-02-01T11:21:01+08:00
author: bbing
draft: false
tags: ["Cpp", "二叉树", "排序"]
categories: ["数据结构与算法", "代码"]
---

## 遍历二叉树的作用

基于二叉树的结构, 衍生出了二叉查找树/平衡二叉查找树/堆等等结构或算法(这些之后会讲), 学会如何遍历一颗二叉树是学习此类"派生二叉树"的基础.

## 二叉树的遍历

我们先来看一颗一般的二叉树. 然后根据不同的遍历方式, 看看这颗二叉树结点最终遍历的顺序.
![一般二叉树](https://s3.ax1x.com/2021/01/25/sOk8ij.png "二叉树")

### 前序遍历

前序遍历就是按照先根结点, 再左右子结点的方式去遍历(```root -> left -> right```).

对一个链式存储的二叉树来说, 代码如下:

```C++
vector<int> pre;
vector<int> preorderTraversal(TreeNode* root) {
    if (!root)
    {
        return pre;
    }

    pre.push_back(root->val);
    preorderTraversal(root->left);
    preorderTraversal(root->right);

    return pre;
}
```

我们先跟着代码的逻辑走一遍:

- N1是根结点, push进队列
```C++
[N1]
```

- 操作N1左子结点N2, N2是N2子树的根结点, push进队列
```C++
[N1, N2]
```

- 操作N2左子结点N4, N4是N4子树的根结点, push进队列
```C++
[N1, N2, N4]
```

- N4没有子结点, 操作N4的父结点N2的右子结点N5, N5是N5子树的根结点, push进队列
```C++
[N1, N2, N4, N5]
```

- 操作N5左子结点N7, N7是N7子树的根结点, push进队列
```C++
[N1, N2, N4, N5, N7]
```

- N7没有子结点, 退回到父结点, 直到发现N1有右子结点N3, N3是N3子树的根结点, push进队列
```C++
[N1, N2, N4, N5, N7, N3]
```

- 操作N3左子结点N6, N6是N6子树的根结点, push进队列, 全部遍历完成
```C++
[N1, N2, N4, N5, N7, N3, N6]
```

所以, 最终按照前序遍历的结果是:
```C++
[N1, N2, N4, N5, N7, N3, N6]
```

使用递归的编程技巧很容易实现前序遍历的代码, 但是递归有太多的临时变量, 随着递归深度的增加, 消耗的内存也在一直增加;
(对二叉树这种结构, 递归还可接受, 递归深度一般是```logn```, 不过极端情况可以达到```n```)

如何不使用递归实现前序遍历呢?

#### 非递归方法实现前序遍历

这里, 我参考图遍历中一般会用的两个表, OPEN表和CLOSE表实现二叉树的前序遍历, OPEN表和CLOSE表在图论中会讲到.
```C++
vector<int> preorderTraversal(TreeNode* root) {
    vector<int> pre;
    if (!root)
    {
        return pre;
    }

    stack<TreeNode *> open;
    vector<TreeNode *> close;

    auto is_visited = [&] (TreeNode * node) -> bool {
        for (const auto cn : close)
        {
            if (cn == node)
            {
                return true;
            }
        }
        return false;
    };

    open.push(root);
    while(!open.empty())
    {
        TreeNode *top = open.top();
        if (!is_visited(top))
        {
            close.emplace_back(top);
            pre.emplace_back(top->val);
        }
        if (top->left && !is_visited(top->left))
        {
            open.push(top->left);
        }
        else if (top->right && !is_visited(top->right))
        {
            open.push(top->right);
        }
        else
        {
            open.pop();
        }
    }

    return pre;
}
```

open表中存储了待遍历的结点, close表中存储了已经遍历过的结点. 那么上述代码的大致思想是:
1. 初始化open表, 将root结点push进表;
2. 如果open表的top元素没有被遍历过(不在close)表, 这储存其值, 并将top结点加入到close表;
3. 如果open表的top元素的left结点存在且没有被遍历过, 则将left结点push进open表;
4. 如果3失败, 但是open表的top元素的right结点存在且没有被遍历过, 则将right结点push进open表;
5. 如果3/4都失败, 则说明子结点不存在或者都被遍历过, 则弹出top元素;

### 中序遍历

中序遍历就是按照先左子结点, 再根结点, 最后右子结点的方式去遍历(```left -> root -> right```).

```C++
vector<int> pre;
vector<int> preorderTraversal(TreeNode* root) {
    if (!root)
    {
        return pre;
    }

    preorderTraversal(root->left);
    pre.push_back(root->val);
    preorderTraversal(root->right);

    return pre;
}
```

中序遍历可以自行思考遍历的过程, 按照中序遍历的结果是:
```C++
[N4, N2, N7, N5, N1, N6, N3]
```

### 后序遍历

后序遍历就是按照先左右子结点, 再根结点的方式去遍历(```left -> right -> root```).

```C++
vector<int> pre;
vector<int> preorderTraversal(TreeNode* root) {
    if (!root)
    {
        return pre;
    }

    preorderTraversal(root->left);
    preorderTraversal(root->right);
    pre.push_back(root->val);

    return pre;
}
```

后序遍历可以自行思考遍历的过程, 按照后序遍历的结果是:
```C++
[N4, N7, N5, N2, N6, N3, N1]
```

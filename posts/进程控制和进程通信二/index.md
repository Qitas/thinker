---
title: "进程控制和进程通信(二)"
slug: "process-ctracon2"
date: 2021-04-23T14:02:57+08:00
lastmod: 2021-04-23T14:03:06+08:00
author: bbing
draft: true
tags: ["进程", "进程通信", "虚拟内存"]
categories: ["操作系统"]
featuredImagePreview: "https://z3.ax1x.com/2021/04/23/cXVQnx.png"
---

我们经常可以看到, 诸如Chrome/VSCode之类的程序打开运行的时候, 可以在后台看到会有多个相关进程启动. 同一个程序启动的不同进程间, 必然存在合作关系, 那么这些进程之间是如何合作的呢?

<!--more-->

## IPC

进程间通信也叫做IPC(InterPorcess Communication). 进程间通信可以让不同的进程共同合作完成某些任务.

不同进程的虚拟内存空间可能会映射到不同的物理内存空间, 但是虚拟内存空间中的虚拟内核空间都会映射到相同的物理内核空间, 因为一般认为系统的内核只有一个.

!["不同进程映射到相同物理内核空间"](https://z3.ax1x.com/2021/04/23/cXVQnx.png "不同进程映射到相同物理内核空间")

所以, 为了剔除用户空间映射不一致的影响, 可以在内核空间操作, 只要在内核空间中开辟相同的物理内存, 供不同进程访问, 那么就可以做到IPC.

!["内核提供共享区域做IPC"](https://z3.ax1x.com/2021/04/23/cXVKj1.png "内核提供共享区域做IPC")

或者, 可以使用文件做IPC. 不同进程只要能够指向相同的文件, 再加上对文件的访问控制, 就可以在不同进程间通过文件系统通信.

!["使用文件系统做IPC"](https://z3.ax1x.com/2021/04/23/cXVucR.png "使用文件系统做IPC")

再或者, 可以通过我们熟知的网络链接做IPC.

!["通过网络做IPC"](https://z3.ax1x.com/2021/04/23/cXZfRH.png "通过网络做IPC")

## 匿名管道

C提供了pipe函数用于创建管道.

### pipe
```C
/* Create a one-way communication channel (pipe).
   If successful, two file descriptors are stored in PIPEDES;
   bytes written on PIPEDES[1] can be read from PIPEDES[0].
   Returns 0 if successful, -1 if not.  */
extern int pipe (int __pipedes[2]) __THROW __wur;
```
pipe输入参数是包含两个pipe描述符的二元数组. pipe执行失败返回-1, 执行成功则返回0, 同时第一个pipe描述符PIPEDES[0]指向pipe的读端, 第二个pipe描述符PIPEDES[1]指向pipe的写端. 调用pipe之后我们拿到了读写端口, 然后再调用fork函数, 现在父子进程都拿到了pipe的读写端口.

!["父子进程都拿到了pipe的读写端口"](https://z3.ax1x.com/2021/04/23/cXUIZ8.png "父子进程都拿到了pipe的读写端口")

> Create a one-way communication channel (pipe).

函数注释中已经说明, pipe是一个one-way communication channel, 只能一个通路, 也就是说只能从一端进一端出, 所以在父子进程必须确定谁来发送, 谁来接收, 不用的端口需要关闭.

下面的例子使用子进程写, 父进程读:
```C
int main()
{
    int pipef[2] = {0, 0};

    int ret = pipe(pipef);
    if (ret < 0)
    {
        printf("create pipe error\n");
        return -1;
    }
    printf("pipef[0] %d, pipef[1] %d\n", pipef[0], pipef[1]);

    int pid = fork();
    if (pid < 0)
    {
        printf("fork error\n");
        return -1;
    }
    else if (pid == 0)
    {
        //close read
        close(pipef[0]);
        char msg[128] = "pipe message.";
        int count = 5;
        while(count-- > 0)
        {
            strcat(msg, "+");
            int write_stat = write(pipef[1], msg, sizeof(msg));
            printf("child send[%d]: %s\n", write_stat, msg);
            // sleep(1);
        }
        printf("write complete\n");
        close(pipef[1]);
    }
    else
    {
        //close write
        close(pipef[1]);
        char msg[1024] = {0};
        int count = 5;
        while(count-- > 0)
        {
            int read_stat = read(pipef[0], msg, sizeof(msg));
            if (read_stat > 0)
            {
                printf("parent get[%d]: ", read_stat);
                for (int i = 0; i < read_stat; i++)
                {
                    printf("%c", msg[i]);
                }
                printf("\n");
            }
        }
        printf("read complete\n");
        close(pipef[0]);
    }
}
```
运行这段代码, 得到输出:
```
pipef[0] 6, pipef[1] 7
child send[128]: pipe message.+
child send[128]: pipe message.++
child send[128]: pipe message.+++
child send[128]: pipe message.++++
child send[128]: pipe message.+++++
write complete
parent get[640]: pipe message.+pipe message.++pipe message.+++pipe message.++++pipe message.+++++
read complete
```
并不符合预期, 子进程已经成功发送了五条信息, 但是父进程一口气全部读出来了, 为什么呢? 实际上这段程序每次执行的结果可能都不同. 这是因为pipe被设计为了循环队列, write负责从一端写, read负责从一端读. 上述问题在与, 还没开始读的时候, 写操作就完成了, 所以读的时候会将所有的数据读出(读的大小设置的1024B, 大于5次写128B共计640B). 所以, 将每次read的size改为每次写的size(=128), 就可以正常读出数据了:
```
pipef[0] 6, pipef[1] 7
parent get[128]: pipe message.+
child send[128]: pipe message.+
child send[128]: pipe message.++
child send[128]: pipe message.+++
parent get[128]: pipe message.++
child send[128]: pipe message.++++
child send[128]: pipe message.+++++
parent get[128]: pipe message.+++
write complete
parent get[128]: pipe message.++++
parent get[128]: pipe message.+++++
read complete
```
所有数据都正常写入和读出, 并且可见是异步的, 符合预期.

从上述信息中我们可以看到, 要使用pipe最好要在读写端约定写入的大小, 以保证可以按此大小读取. 一般来说, pipe读写可能会遇到四个问题:
1. 读端和写端都是打开的, 但是还没有读, 这时候写端正常, 直到pipe被写满, 这会阻塞, 直到read将pipe里面的数据读出, pipe有空闲位置;
2. 读端和写端都是打开的, 但是还没有写, 这时候如果pipe中有数据, 这正常读, 如果没有数据, 则阻塞, 直到往pipe里写入数据;
3. 读端打开, 写端关闭, 这时候读端正常工作, 不阻塞, read返回值标识读到的数据大小, 为0则标识没有数据了;
4. 读端关闭, 写端打开, 这时候会触发SIGPIPE信号, 此时往往是异常状态;

### pipe全双工

使用两个pipe可以实现全双工通信.
```C
int main()
{
    int pipef[2] = {0, 0};
    int pipes[2] = {0, 0};

    int ret = pipe(pipef);
    if (ret < 0)
    {
        printf("create pipe error\n");
        return -1;
    }
    ret = pipe(pipes);
    if (ret < 0)
    {
        printf("create pipe error\n");
        return -1;
    }
    printf("pipef[0] %d, pipef[1] %d\n", pipef[0], pipef[1]);
    printf("pipes[0] %d, pipes[1] %d\n", pipes[0], pipes[1]);

    int pid = fork();

    if (pid < 0)
    {
        printf("fork error\n");
        return -1;
    }
    else if (pid == 0)
    {
        //close read
        close(pipef[0]);
        //close write
        close(pipes[1]);
        char msg[128] = "child message.";
        int count = 5;
        while(count-- > 0)
        {
            strcat(msg, "+");
            int write_stat = write(pipef[1], msg, sizeof(msg));
            printf("child send[%d]: %s\n", write_stat, msg);

            char read_msg[1024] = {0};
            int read_stat = read(pipes[0], read_msg, sizeof(read_msg));
            if (read_stat > 0)
            {
                printf("get from parent: %s\n", read_msg);
            }
        }
        printf("child complete\n");
        close(pipef[1]);
        close(pipes[0]);
    }
    else
    {
        //close write
        close(pipef[1]);
        //close read
        close(pipes[0]);
        char msg[128] = "parent message.";
        int count = 5;
        while(count-- > 0)
        {
            strcat(msg, "+");
            int write_stat = write(pipes[1], msg, sizeof(msg));
            printf("parent send[%d]: %s\n", write_stat, msg);

            char read_msg[1024] = {0};
            int read_stat = read(pipef[0], read_msg, sizeof(read_msg));
            if (read_stat > 0)
            {
                printf("get from child: %s\n", msg);
            }
        }
        printf("parent complete\n");
        close(pipef[0]);
        close(pipes[1]);
    }
}
```
输出可能是:
```
pipef[0] 6, pipef[1] 7
pipes[0] 8, pipes[1] 9
parent send[128]: parent message.+
child send[128]: child message.+
get from parent: parent message.+
child send[128]: child message.++
get from child: parent message.+
parent send[128]: parent message.++
get from parent: parent message.++
child send[128]: child message.+++
get from child: parent message.++
parent send[128]: parent message.+++
get from parent: parent message.+++
child send[128]: child message.++++
get from child: parent message.+++
parent send[128]: parent message.++++
get from parent: parent message.++++
child send[128]: child message.+++++
get from child: parent message.++++
parent send[128]: parent message.+++++
get from parent: parent message.+++++
child complete
parent complete
```
可以看到, 读取的时候并没有和写入端约定大小, 但是这时候是可以正常读的, 为什么呢? 分析一下代码可能的逻辑:
1. 子进程先走, 正常write, read的时候, pipe中没有数据, 则阻塞; 父进程走, 正常write, 子进程的read读到了数据, 退出阻塞, 父进程可以正常读到子进程write的数据;
2. 父进程先走, 正常write, read的时候, pipe中没有数据, 则阻塞; 子进程走, 正常write, 父进程的read读到了数据, 退出阻塞, 子进程可以正常读到父进程write的数据;
所以, 无论父子进程怎么走, 都可以保证父子进程的正常读写.

### pipe的容量和原子性
上面的例子都没有填满pipe, 也都默认了pipe的读写都是原子的. 到这里又想到了两个问题:
1. pipe什么时候写满?
2. pipe读写怎么保证是原子操作?


### pipe源码
```C
/*
 * sys_pipe() is the normal C calling standard for creating
 * a pipe. It's not the way Unix traditionally does this, though.
 */
static int do_pipe2(int __user *fildes, int flags)
{
	struct file *files[2];
	int fd[2];
	int error;
	error = __do_pipe_flags(fd, files, flags);
	if (!error) {
		if (unlikely(copy_to_user(fildes, fd, sizeof(fd)))) {
			fput(files[0]);
			fput(files[1]);
			put_unused_fd(fd[0]);
			put_unused_fd(fd[1]);
			error = -EFAULT;
		} else {
			fd_install(fd[0], files[0]);
			fd_install(fd[1], files[1]);
		}
	}
	return error;
}
```

```C
static int __do_pipe_flags(int *fd, struct file **files, int flags)
{
	int error;
	int fdw, fdr;
	if (flags & ~(O_CLOEXEC | O_NONBLOCK | O_DIRECT))
		return -EINVAL;
	error = create_pipe_files(files, flags);
	if (error)
		return error;
	error = get_unused_fd_flags(flags);
	if (error < 0)
		goto err_read_pipe;
	fdr = error;
	error = get_unused_fd_flags(flags);
	if (error < 0)
		goto err_fdr;
	fdw = error;
	audit_fd_pair(fdr, fdw);
	fd[0] = fdr;
	fd[1] = fdw;
	return 0;
 err_fdr:
	put_unused_fd(fdr);
 err_read_pipe:
	fput(files[0]);
	fput(files[1]);
	return error;
}
```

### 小结

综上所述:
1. pipe是半双工;
2. 两个pipe可以实现全双工;
3. 读写端都存在时, pipe满则阻塞写端, pipe空则阻塞读端;
4. 读端不存在, 则写时触发SIGPIPE信号, 写端不存在时, 读正常, 但是不阻塞;

## 具名管道

## 消息队列

## 信号

## 信号量

## 共享内存

## socket

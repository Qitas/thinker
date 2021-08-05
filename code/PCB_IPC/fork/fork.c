#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sched.h>
#include <signal.h>
#include <malloc.h>

#define FIBER_STACK 8192

// void inc(const char* s, int pid, int i)
// {
//     printf("%s processor [%d %d] %d\n", s, getppid(), getpid(), i);
// }

// int main()
// {
//     volatile int i = 0;
//     // int pid = fork();
//     int pid = vfork();
//     i = 100;
//     if (pid < 0)
//     {
//         printf("fork error");
//         return -1;
//     }
//     else if (pid == 0)
//     {
//         for (int j = 0; j < 100; j++)
//         {
//             inc("child", pid, i++);
//         }
//     }
//     else
//     {
//         for (int j = 0; j < 20; j++)
//         {
//             inc("parent", pid, i++);
//         }
//     }

//     i = 0;
//     exit(0);
// }

int addone(int *n)
{
    *n = 21;
    printf("[%d %d] add one %d\n", getppid(), getpid(), (*n));
}

int main()
{
    volatile int n = 0;
    void* st;
    st = malloc(FIBER_STACK);

    if (!st)
    {
        printf("error malloc\n");
        return -1;
    }

    printf("create clone\n");
    printf("[%d %d] before add %d\n", getppid(), getpid(), n);
    clone(&addone, (char *)st + FIBER_STACK, CLONE_VM|CLONE_VFORK, &n);
    printf("[%d %d] after add %d\n", getppid(), getpid(), n);

    free(st);
    return 1;
}
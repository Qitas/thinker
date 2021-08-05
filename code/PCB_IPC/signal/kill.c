#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    int signo = SIGUSR1;
    int pid = atoi(argv[1]);

    kill(pid, signo);
    printf("send sig %d to pid %d\n", signo, pid);
}
#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

void signalPorcessor(int signo)
{
    printf("process %d receive signal %d\n", getpid(), signo);
}

int main() {
    printf("current pid %d\n", getpid());
    signal(SIGUSR1, signalPorcessor);

    while(1) {
        printf("process %d doing something\n", getpid());
        sleep(1);
    }
}
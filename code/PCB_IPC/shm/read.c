#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>

#define SHM_KEY 7777
#define BUF_SIZ 1024


int main()
{
    int shm_id = shmget(SHM_KEY, BUF_SIZ, IPC_EXCL);
    if (shm_id < 0)
    {
        shm_id = shmget(SHM_KEY, BUF_SIZ, IPC_CREAT | 0666);
    }

    if (shm_id < 0)
    {
        printf("get shm failed!");
        return -1;
    }

    printf("shm key %d id %d\n", SHM_KEY, shm_id);

    char* shmem = shmat(shm_id, NULL, 0);
    while(1)
    {
        printf("[%d]get msg: %s\n", getpid(), shmem);
        // sleep(1);
    }
}
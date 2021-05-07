#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/sem.h>
#include "utils.h"

#define SHM_KEY 7777
#define SEM_KEY 8888
#define BUF_SIZ 1024

int main()
{
    int shm_id = shmget(SHM_KEY, BUF_SIZ, IPC_CREAT | 0666);
    int sem_id = semget(SEM_KEY, 1, IPC_CREAT | 0666);
    init(sem_id);
    printf("shm key %d id %d, sem key %d id %d\n", SHM_KEY, shm_id, SEM_KEY, sem_id);

    char* shmem = shmat(shm_id, NULL, 0);
    while(1)
    {
        lock(sem_id);
        printf("[%d]get msg: %s\n", getpid(), shmem);
        unlock(sem_id);
        // sleep(1);
    }
    uinit(sem_id);
}
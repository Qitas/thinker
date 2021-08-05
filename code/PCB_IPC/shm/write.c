#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>

#define SHM_KEY 7777
#define BUF_SIZ 1024

int main(int argc, char **argv)
{
    time_t t;
    int mode = 0;
    srand((unsigned) time(&t));
    if (argc > 1)
    {
        mode = atoi(argv[1]);
        srand(mode);
    }

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

    // for (int i = 0; i < 3; i++)
    for(;;)
    {
        char msg[512] = {0};
        // for (int j = 0; j < 20; j++)
        // {
        //     msg[j] = rand() % 26 + 65;
        // }
        switch(mode)
        {
            case 0:
                memcpy(shmem, "0000000000", sizeof(msg));
                break;
            case 1:
                memcpy(shmem, "1111111111", sizeof(msg));
                break;
            case 2:
                memcpy(shmem, "2222222222", sizeof(msg));
                break;
            case 3:
                memcpy(shmem, "3333333333", sizeof(msg));
                break;
        }
        // memcpy(shmem, msg, BUF_SIZ);
        printf("[%d]write msg: %s\n", getpid(), shmem);
        // sleep(1);
    }

    // shmdt(shmem);
    // shmctl(shm_id, IPC_RMID, NULL);
}
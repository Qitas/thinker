#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/sem.h>

struct sembuf sem;
union semun
{
    int val;
    struct semid_ds *buf;
    unsigned short int *array;
    struct seminfo *__buf;
};

void init(int sem_id)
{
    union semun sem_union;

    sem_union.val = 1;
    semctl(sem_id, 0, SETVAL, sem_union);
}
void uinit(int sem_id)
{
    union semun sem_union;
    semctl(sem_id, 0, IPC_RMID, sem_union);
}
void lock(int sem_id)
{
    sem.sem_num = 0;
    sem.sem_op = -1;
    sem.sem_flg = SEM_UNDO;
    semop(sem_id, &sem, 1);
}
void unlock(int sem_id)
{
    sem.sem_num = 0;
    sem.sem_op = 1;
    sem.sem_flg = SEM_UNDO;
    semop(sem_id, &sem, 1);
}
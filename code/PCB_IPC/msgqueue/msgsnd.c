#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/msg.h>

#define MSG_KEY 7777

struct MSG {
    long type;
    char msg[1024];
};

int main() {
    int msg_id = msgget(MSG_KEY, IPC_EXCL);
    if (msg_id < 0)
    {
        msg_id = msgget(MSG_KEY, IPC_CREAT | 0666);
    }

    if (msg_id < 0)
    {
        printf("get msg queue failed!");
        return -1;
    }
    printf("msq key %d id %d\n", MSG_KEY, msg_id);

    while(1)
    {
        struct MSG msg;
        printf("msg type: ");
        scanf("%ld", &msg.type);
        printf("msg info: ");
        scanf("%s", &msg.msg);
        int snd_id = msgsnd(msg_id, &msg, sizeof(msg.msg), IPC_NOWAIT);
        if (snd_id < 0)
        {
            printf("send msg failed with errno=%d[%s]\n", errno, strerror(errno));
    		msgctl(msg_id, IPC_RMID, 0);
            return -1;
        }
    }
}

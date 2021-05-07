#include <stdio.h>
#include <string.h>
#include <stdlib.h>
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
        for (int id = 0; id < 100; id++)
        {
            msg.type = id;
            int rev_id = msgrcv(msg_id, &msg, sizeof(msg.msg), msg.type, IPC_NOWAIT);
            if (rev_id > 0)
            {
                printf("rev msg[%ld]: %s\n", msg.type, msg.msg);
            }
        }
    }
}

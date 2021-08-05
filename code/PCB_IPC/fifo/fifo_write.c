#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <limits.h>
#include <string.h>

static const char* fifo_name = "./fifo_pipe";

int main()
{
    if(access(fifo_name, F_OK) == -1)
    {
        printf("[%d] make fifo...\n", getpid());
        int stats = mkfifo(fifo_name, 0777);
        if (stats != 0)
        {
            printf("[%d] make fifo error.\n", getpid());
            return -1;
        }
    }

    int fifo_fd = open(fifo_name, O_WRONLY);
    printf("[%d] writer open fifo fd %d\n", getpid(), fifo_fd);

    if (fifo_fd != -1)
    {
        char msg[1024*1024] = "fifo write.";
        for(int i = 0; i < 2; i++)
        {
            int write_stat = write(fifo_fd, msg, sizeof(msg));
            printf("[%d] fifo write[%d %d]: '%s'\n", getpid(), write_stat, i, msg);
        }
    }
    close(fifo_fd);

    return 1;
}

// int main()
// {
//     if(access(fifo_name, F_OK) == -1)
//     {
//         printf("[%d] make fifo...\n", getpid());
//         int stats = mkfifo(fifo_name, 0777);
//         if (stats != 0)
//         {
//             printf("[%d] make fifo error.\n", getpid());
//             return -1;
//         }
//     }

//     int fifo_fd = open(fifo_name, O_WRONLY|O_RDONLY);
//     printf("[%d] writer open fifo fd %d\n", getpid(), fifo_fd);

//     if (fifo_fd != -1)
//     {
//         char msg[128] = "fifo write.";
//         printf("[%d] fifo write: '%s'\n", getpid(), msg);
//         write(fifo_fd, msg, sizeof(msg));
//         memset(msg, 0, sizeof(msg));
//         read(fifo_fd, msg, sizeof(msg));
//         printf("[%d] fifo read: '%s'\n", getpid(), msg);
//     }
//     close(fifo_fd);

//     return 1;
// }
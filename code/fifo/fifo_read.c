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
        printf("[%d] reader get fifo error.\n", getpid());
        return -1;
    }

    printf("[%d] read prepare open fifo.\n", getpid());
    int fifo_fd = open(fifo_name, O_RDONLY);
    printf("[%d] open fifo fd %d\n", getpid(), fifo_fd);

    if (fifo_fd != -1)
    {
        char msg[128];
        int read_stat = read(fifo_fd, msg, sizeof(msg));
        printf("[%d] fifo read[%d]: '%s'\n", getpid(), read_stat, msg);
    }
    close(fifo_fd);

    return 1;
}
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#include "utils.h"

int main(int argc, char **argv)
{
    char say[1024];

    while (1)
    {
        int serv_sock = connect_socket(argv[1], atoi(argv[2]));

        memset(say, 0, sizeof(say));
        printf("you say: ");
        char *s = fgets(say, sizeof(say), stdin);
        say[strlen(s) - 1] = '\0';

        if (strcmp(say, "q") == 0) {
            break;
        }

        write(serv_sock, say, sizeof(say));

        memset(say, 0, sizeof(say));
        read(serv_sock, say, sizeof(say));
        printf("%s say: %s\n", argv[1], say);

        close(serv_sock);
    }

    return 0;
}
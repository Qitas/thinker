#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>

#include "utils.h"

int main(int argc, char **argv){
    int serv_sock = bind_socket(argv[1], atoi(argv[2]));
    listen(serv_sock, 1024);

    struct sockaddr_in clnt_addr;
    socklen_t clnt_addr_size = sizeof(clnt_addr);
    char say[1024];
    while(1)
    {
        int clnt_sock = accept(serv_sock, (struct sockaddr*)&clnt_addr, &clnt_addr_size);

        memset(say, 0, sizeof(say));
        read(clnt_sock, say, sizeof(say));
        printf("%s say: %s\n", inet_ntoa(clnt_addr.sin_addr), say);

        memset(say, 0, sizeof(say));
        printf("you say: ");
        char *s = fgets(say, sizeof(say), stdin);
        say[strlen(s) - 1] = '\0';
        write(clnt_sock, say, sizeof(say));

        close(clnt_sock);
    }

    close(serv_sock);

    return 0;
}
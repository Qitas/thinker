#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>

void init_socket(int *sock, struct sockaddr_in *serv_addr, const char* ip, const int &port)
{
    *sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

    memset(serv_addr, 0, sizeof(struct sockaddr_in));
    serv_addr->sin_family = AF_INET;
    serv_addr->sin_addr.s_addr = inet_addr(ip);
    serv_addr->sin_port = htons(port);
}

int bind_socket(const char* ip, const int &port)
{
    int sock;
    struct sockaddr_in serv_addr;
    init_socket(&sock, &serv_addr, ip, port);
    bind(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));

    return sock;
}

int connect_socket(const char* ip, const int &port)
{
    int sock;
    struct sockaddr_in serv_addr;
    init_socket(&sock, &serv_addr, ip, port);
    connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));

    return sock;
}
#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>
#include<string.h>

int main()
{
    int pipef[2] = {0, 0};

    int ret = pipe(pipef);
    if (ret < 0)
    {
        printf("create pipe error\n");
        return -1;
    }
    printf("pipef[0] %d, pipef[1] %d\n", pipef[0], pipef[1]);

    int pid = fork();
    if (pid < 0)
    {
        printf("fork error\n");
        return -1;
    }
    else if (pid == 0)
    {
        //close read
        close(pipef[0]);
        // char msg[10240] = "pipe message.";
        char msg[1];
        int count = 0;
        while(++count > 0)
        {
            strcat(msg, "+");
            int write_stat = write(pipef[1], msg, sizeof(msg));
            // printf("child send[%d]\n", count);
            // sleep(1);
        }
        printf("write complete %d\n", count);
        close(pipef[1]);
    }
    else
    {
        //close write
        close(pipef[1]);
        char msg[1024] = {0};
        int count = 5;
        while(count-- > 0)
        {
            sleep(1);
        }
        printf("read complete\n");
        close(pipef[0]);
    }
}

// int main()
// {
//     int pipef[2] = {0, 0};

//     int ret = pipe(pipef);
//     if (ret < 0)
//     {
//         printf("create pipe error\n");
//         return -1;
//     }
//     printf("pipef[0] %d, pipef[1] %d\n", pipef[0], pipef[1]);

//     int pid = fork();
//     if (pid < 0)
//     {
//         printf("fork error\n");
//         return -1;
//     }
//     else if (pid == 0)
//     {
//         //close read
//         close(pipef[0]);
//         char msg[128] = "pipe message.";
//         int count = 5;
//         while(count-- > 0)
//         {
//             strcat(msg, "+");
//             int write_stat = write(pipef[1], msg, sizeof(msg));
//             printf("child send[%d]: %s\n", write_stat, msg);
//             // sleep(1);
//         }
//         printf("write complete\n");
//         close(pipef[1]);
//     }
//     else
//     {
//         //close write
//         close(pipef[1]);
//         char msg[1024] = {0};
//         int count = 5;
//         while(count-- > 0)
//         {
//             int read_stat = read(pipef[0], msg, 128);
//             if (read_stat > 0)
//             {
//                 printf("parent get[%d]: ", read_stat);
//                 for (int i = 0; i < read_stat; i++)
//                 {
//                     printf("%c", msg[i]);
//                 }
//                 printf("\n");
//             }
//         }
//         printf("read complete\n");
//         close(pipef[0]);
//     }
// }

// int main()
// {
//     int pipef[2] = {0, 0};
//     int pipes[2] = {0, 0};

//     int ret = pipe(pipef);
//     if (ret < 0)
//     {
//         printf("create pipe error\n");
//         return -1;
//     }
//     ret = pipe(pipes);
//     if (ret < 0)
//     {
//         printf("create pipe error\n");
//         return -1;
//     }
//     printf("pipef[0] %d, pipef[1] %d\n", pipef[0], pipef[1]);
//     printf("pipes[0] %d, pipes[1] %d\n", pipes[0], pipes[1]);

//     int pid = fork();

//     if (pid < 0)
//     {
//         printf("fork error\n");
//         return -1;
//     }
//     else if (pid == 0)
//     {
//         //close read
//         close(pipef[0]);
//         //close write
//         close(pipes[1]);
//         char msg[128] = "child message.";
//         int count = 5;
//         while(count-- > 0)
//         {
//             strcat(msg, "+");
//             int write_stat = write(pipef[1], msg, sizeof(msg));
//             printf("child send[%d]: %s\n", write_stat, msg);

//             char read_msg[1024] = {0};
//             int read_stat = read(pipes[0], read_msg, sizeof(read_msg));
//             if (read_stat > 0)
//             {
//                 printf("get from parent: %s\n", read_msg);
//             }
//         }
//         printf("child complete\n");
//         close(pipef[1]);
//         close(pipes[0]);
//     }
//     else
//     {
//         //close write
//         close(pipef[1]);
//         //close read
//         close(pipes[0]);
//         char msg[128] = "parent message.";
//         int count = 5;
//         while(count-- > 0)
//         {
//             strcat(msg, "+");
//             int write_stat = write(pipes[1], msg, sizeof(msg));
//             printf("parent send[%d]: %s\n", write_stat, msg);

//             char read_msg[1024] = {0};
//             int read_stat = read(pipef[0], read_msg, sizeof(read_msg));
//             if (read_stat > 0)
//             {
//                 printf("get from child: %s\n", msg);
//             }
//         }
//         printf("parent complete\n");
//         close(pipef[0]);
//         close(pipes[1]);
//     }
// }
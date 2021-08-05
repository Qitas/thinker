#include <stdlib.h>
#include <unistd.h>

int main()
{
    while(1){
        int pid = fork();
        if (pid < 0) {return 1;}
        else if (pid == 0) { break; }
        else { continue; }
    }

    int i = 0;
    while(1) {
        long long s = sizeof(int) * 1024 * 1024;
        int *p = malloc(s);
        memset(p, i++, s);
    }

    return 1;
}
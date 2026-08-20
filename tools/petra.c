#include <stdio.h>
#include <string.h>

static unsigned char enc[31] = {58, 56, 119, 96, 79, 20, 28, 95, 85, 0, 68, 51, 67, 91, 5, 0, 4, 93, 67, 1, 47, 24, 92, 0, 107, 17, 13, 26, 2, 1, 13};
static const char key[] = "p3tr4s1l4n";

int main(int argc, char **argv) {
    if (argc != 2) { fprintf(stderr, "usage: ./petra <flag>\n"); return 1; }
    size_t n = strlen(argv[1]);
    if (n != sizeof(enc)) { fprintf(stderr, "ditolak.\n"); return 1; }
    for (size_t i = 0; i < n; i++) {
        unsigned char k = (unsigned char)key[(i * 7) % (sizeof(key) - 1)];
        if (((unsigned char)argv[1][i] ^ k) != enc[i]) {
            fprintf(stderr, "ditolak.\n");
            return 1;
        }
    }
    puts("diterima. bendera valid.");
    return 0;
}

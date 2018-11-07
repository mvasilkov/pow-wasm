#include <stdio.h>

#include "../BLAKE2/blake2.h"

#define BUF_SIZE 0x100000

struct buf
{
    uint32_t length;
    uint8_t contents[BUF_SIZE];
} buf;

struct buf *get_buf()
{
    return &buf;
}

void print_blake2b()
{
    printf("buf.length = %d\n", buf.length);

    uint8_t hash[BLAKE2B_OUTBYTES];
    blake2b(hash, BLAKE2B_OUTBYTES, buf.contents, buf.length, NULL, 0);

    for (int j = 0; j < BLAKE2B_OUTBYTES; ++j)
        printf("%02x", hash[j]);

    puts("");
}

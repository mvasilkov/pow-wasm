/* This file is part of the pastechan project.
 * https://github.com/mvasilkov/pastechan
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */
#include <stdint.h>

#include "../BLAKE2/blake2.h"

#define BUF_SIZE 1048600
#define BLAKE2B_OUTDWORDS 16
#define NONCE_CARDINALITY 0x20000000000000

struct buf
{
    uint32_t length;
    uint8_t contents[BUF_SIZE];
} buf;

struct buf *get_buf()
{
    return &buf;
}

double solve(int bits)
{
    uint8_t hash[BLAKE2B_OUTBYTES];
    uint32_t *u32hash = (uint32_t *)hash;
    int64_t *pn = (int64_t *)buf.contents;

    for (int64_t n = 0; n < NONCE_CARDINALITY; ++n)
    {
        *pn = n;
        blake2b(hash, BLAKE2B_OUTBYTES, buf.contents, buf.length, NULL, 0);

        int count = 0;
        for (int p = 0; p < BLAKE2B_OUTDWORDS; ++p)
        {
            uint32_t a = u32hash[p];
            if (a)
            {
                count += __builtin_clz(a);
                break;
            }
            count += 32;
        }

        if (count >= bits)
            return n;
    }

    return NONCE_CARDINALITY;
}

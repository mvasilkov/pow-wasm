/* This file is part of the pastechan project.
 * https://github.com/mvasilkov/pastechan
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */
'use strict'

const assert = require('assert')
const crypto = require('crypto')

assert(crypto.getHashes().includes('blake2b512'))

const NONCE_CARDINALITY = 0x20000000000000

const dwordLo = a => a & 0xffffffff
const dwordHi = a => (a / 0x100000000) & 0xffffffff

exports.solve = function solve(salt, bits, contents, done) {
    const bufNonce = Buffer.allocUnsafe(8)

    const bufSep = Buffer.from('\t', 'utf8')
    const bufSalt = Buffer.from(salt, 'hex')

    const bufBits = Buffer.allocUnsafe(1)
    bufBits.writeUInt8(bits, 0)

    for (let n = 0; n < NONCE_CARDINALITY; ++n) {
        bufNonce.writeUInt32LE(dwordLo(n), 0)
        bufNonce.writeUInt32LE(dwordHi(n), 4)

        let h = crypto.createHash('blake2b512')
        h.update(bufNonce)
        h.update(bufSep)
        h.update(bufSalt)
        h.update(bufSep)
        h.update(bufBits)
        h.update(bufSep)
        h.update(contents, 'utf8')
        h = h.digest()

        let count = 0
        for (let p = 0; p < 64; p += 4) {
            const a = h.readUInt32LE(p)
            if (a) {
                count += 32 - Math.floor(Math.log2(a) + 1)
                break
            }
            count += 32
        }

        if (count >= bits) return n
    }

    return NONCE_CARDINALITY
}

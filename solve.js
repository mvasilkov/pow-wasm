/* This file is part of the pastechan project.
 * https://github.com/mvasilkov/pastechan
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */
'use strict'

const HEADER_SIZE = 24

exports.solve = function loading() {
    throw Error('Loading')
}

require('./pow/solve')().then(Module => {
    if (!Module.usingWasm) {
        throw Error('Not good')
    }

    exports.solve = function solve(salt, bits, contents, done) {
        contents = (new TextEncoder).encode(contents)

        const buf_pointer = Module.ccall('get_buf', 'number')
        const mem = Module.wasmMemory.buffer
        const u32 = new Uint32Array(mem, buf_pointer, 1)
        const u8 = new Uint8Array(mem, buf_pointer + 4, u32[0] = contents.length + HEADER_SIZE)

        // nonce : salt : bits : contents
        u8.set([9, ...bytes(salt), 9, bits, 9], 8)
        u8.set(contents, HEADER_SIZE)

        done(Module.ccall('solve', 'number', ['number'], [bits]))
    }
})

function bytes(a) {
    const b = []
    for (let n = 0; n < a.length; n += 2) {
        b.push(parseInt(a.substr(n, 2), 16))
    }
    return b
}

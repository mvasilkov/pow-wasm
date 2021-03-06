/* This file is part of the pastechan project.
 * https://github.com/mvasilkov/pastechan
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */
'use strict'

const HEADER_SIZE = 24
const CONTENT_SIZE = 0x100000

// https://github.com/iliakan/detect-node
const isNode = Object.prototype.toString.call(typeof process != 'undefined' ? process : 0) == '[object process]'

let _solve

const wait = new Promise(done => {
    require('./pow/solve')().then(Module => {
        if (!Module.usingWasm) {
            throw Error('Not good')
        }

        if (isNode && typeof TextEncoder == 'undefined') {
            global.TextEncoder = require('util').TextEncoder
        }

        _solve = function solve(salt, bits, contents) {
            contents = (new TextEncoder).encode(contents)

            if (contents.length > CONTENT_SIZE) {
                throw Error('Much content')
            }

            const buf_pointer = Module.ccall('get_buf', 'number')
            const mem = Module.wasmMemory.buffer
            const u32 = new Uint32Array(mem, buf_pointer, 1)
            const u8 = new Uint8Array(mem, buf_pointer + 4, u32[0] = contents.length + HEADER_SIZE)

            // nonce : salt : bits : contents
            u8.set([9, ...bytes(salt), 9, bits, 9], 8)
            u8.set(contents, HEADER_SIZE)

            return Module.ccall('solve', 'number', ['number'], [bits])
        }

        done()
    })
})

function bytes(a) {
    const b = []
    for (let n = 0; n < a.length; n += 2) {
        b.push(parseInt(a.substr(n, 2), 16))
    }
    return b
}

exports.solve = (salt, bits, contents) =>
    wait.then(() => _solve(salt, bits, contents))

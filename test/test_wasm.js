Module.onRuntimeInitialized = function () {
    console.log('onRuntimeInitialized')

    assert(Module.usingWasm)

    const utf8 = (new TextEncoder).encode('oh hai')

    const buf_pointer = Module.ccall('get_buf', 'number')
    const u32view = new Uint32Array(Module.wasmMemory.buffer, buf_pointer, 1)
    const u8view = new Uint8Array(Module.wasmMemory.buffer, buf_pointer + 4, 6)

    u32view[0] = 6
    for (let n = 0; n < 6; ++n)
        u8view[n] = utf8[n]

    Module.ccall('print_blake2b')
}

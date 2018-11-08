# pow-wasm

Proof of Work based on BLAKE2b, written in JavaScript and WebAssembly

**Message format**

| Name | Type | Size | Comment
| --- | --- | --- | ---
| nonce | int64 | 8 | Little-endian int53
| salt | ObjectId | 12 |
| bits | int8 | 1 |
| contents | UTF-8 || Capped at 1 MiB

The field separator is `'\t'`

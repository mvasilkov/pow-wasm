pow-wasm
===

Proof of work similar to Hashcash, based on BLAKE2b, written in JavaScript and WebAssembly

Installation
---

```sh
yarn add pow-wasm
```

Usage
---

```js
const ObjectId = require('bson').ObjectId
const solve = require('pow-wasm/solve').solve
const validate = require('pow-wasm').validate

const salt = '' + ObjectId()
console.log(salt) // 5be97e10b697c24689180e9b

solve(salt, 20, 'oh hai').then(nonce => {
    console.log(nonce) // 1013723
    const result = validate(nonce, salt, 20, 'oh hai')
    console.log(result) // true
})
```

**Message format**

| Name | Type | Size | Comment
| --- | --- | --- | ---
| nonce | int64 | 8 | Little-endian int53
| salt | ObjectId | 12 |
| bits | int8 | 1 |
| contents | UTF-8 || Capped at 1 MiB

The field separator is `'\t'`

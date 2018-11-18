import test from 'ava'

import { solve } from '../solve'
import { validate } from '../validate'

const objectid = '5be85a46ae56cd2dc568a339'

test('validate', async t => {
    for (let n = 0; n < 20; ++n) {
        const options = [objectid, n, 'hello world']
        const a = await solve(...options)
        const b = validate(a, ...options)

        t.is(typeof a, 'number')
        t.is(typeof b, 'boolean')
        t.is(b, true)
    }
})

test('validate utf8', async t => {
    for (let n = 0; n < 20; ++n) {
        const options = [objectid, n, 'чочо упячка']
        const a = await solve(...options)
        const b = validate(a, ...options)

        t.is(typeof a, 'number')
        t.is(typeof b, 'boolean')
        t.is(b, true)
    }
})

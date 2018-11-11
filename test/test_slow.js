import test from 'ava'

import { solve } from '../solve'
import { solve as solve2 } from '../slow_solve'

const pSolve = (salt, bits, contents) =>
    new Promise(done => solve(salt, bits, contents, done))

const pSolve2 = (salt, bits, contents) =>
    new Promise(done => solve2(salt, bits, contents, done))

const objectid = '5be85a46ae56cd2dc568a339'

test('slow', async t => {
    for (let n = 0; n < 20; ++n) {
        const options = [objectid, n, 'hello world']
        const a = await pSolve(...options)
        const b = await pSolve2(...options)

        t.is(typeof a, 'number')
        t.is(typeof b, 'number')
        t.is(a, b)
    }
})

test('slow utf8', async t => {
    for (let n = 0; n < 20; ++n) {
        const options = [objectid, n, 'чочо упячка']
        const a = await pSolve(...options)
        const b = await pSolve2(...options)

        t.is(typeof a, 'number')
        t.is(typeof b, 'number')
        t.is(a, b)
    }
})

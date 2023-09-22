import { createParser } from '../parser'

describe('parser', () => {
    it('read', () => {
        const code = `int a = 1;`
        createParser(code)
    })

})

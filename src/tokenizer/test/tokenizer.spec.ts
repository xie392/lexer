import { createTokenizer } from '../tokenizer'

describe('tokenizer', () => {
    it('lexer', () => {
        const code = `
        #include <stdio.h>
        int add() {
            // 注释
            let a = 1.1, b = 2;
            return a + b;
        }`
        createTokenizer(code)
    })

    it('read', () => {
        const code = `int a = 1;`
        createTokenizer(code)
    })
})

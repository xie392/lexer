import TokenizerImpl from '../tokenizer'

describe('tokenizer', () => {
    it('lexer', () => {
        const code = `int add() {
            // 注释
            let a = 1.1, b = 2;
            return a + b;
        }`
        const tokenizer = new TokenizerImpl(code)
        tokenizer.lexer()
    })
})

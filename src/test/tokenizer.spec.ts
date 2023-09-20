import TokenizerImpl from "../tokenizer"

describe('tokenizer', () => {

    it('lexer', () => {
        const tokenizer = new TokenizerImpl('int main{')
        tokenizer.lexer()
    })
})
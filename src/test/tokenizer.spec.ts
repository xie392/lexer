import TokenizerImpl from "../tokenizer"

describe('tokenizer', () => {

    // it('lexer processIdentifier', () => {
    //     const source = `int a`
    //     const tokenizer = new TokenizerImpl(source)
    //     const tokens =  tokenizer.lexer()
    //     expect(tokens.length).toBe(2)
    // })

    // it('lexer processNumber', () => {
    //     const source = `123`
    //     const tokenizer = new TokenizerImpl(source)
    //     const tokens =  tokenizer.lexer()
    //     expect(tokens.length).toBe(1)
    // })

    it('lexer processType', () => {
        const source = `int main(){
return 1;
}`
        const tokenizer = new TokenizerImpl(source)
        tokenizer.lexer()
        // const tokens =  tokenizer.lexer()
        // expect(tokens.length).toBe(5)
    })
})
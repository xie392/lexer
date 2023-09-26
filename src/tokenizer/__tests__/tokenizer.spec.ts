import Tokenizer from '../index'

describe('tokenizer', () => {
    it('identifier', () => {
        const source = `a bb c $aabb`
        const tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['IDENTIFIER', 'a'],
            ['IDENTIFIER', 'bb'],
            ['IDENTIFIER', 'c'],
            ['IDENTIFIER', '$aabb']
        ])
    })

    it('keyword', () => {
        const source = `int char float`
        const tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['KEYWORD', 'int'],
            ['KEYWORD', 'char'],
            ['KEYWORD', 'float']
        ])
    })

    it('number', () => {
        let source = `1 2`
        let tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['NUMBER', '1'],
            ['NUMBER', '2']
        ])

        source = `1.1 1.2`
        tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['NUMBER', '1.1'],
            ['NUMBER', '1.2']
        ])

        source = `1.1.1`
        expect(() => {
            new Tokenizer(source).lexer()
        }).toThrowError()
    })

    it('operator', () => {
        const source = `+ - * / +=`
        const tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['OPERATOR', '+'],
            ['OPERATOR', '-'],
            ['OPERATOR', '*'],
            ['OPERATOR', '/'],
            ['OPERATOR', '+=']
        ])
    })

    it('string', () => {
        const source = `'hello' "world"`
        const tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['STRING', 'hello'],
            ['STRING', 'world']
        ])
    })

    it('brackets', () => {
        let source = `{ [ ( ) ] }`
        const tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['OPERATOR', '{'],
            ['OPERATOR', '['],
            ['OPERATOR', '('],
            ['OPERATOR', ')'],
            ['OPERATOR', ']'],
            ['OPERATOR', '}']
        ])

        source = `[ [ ( ) ] ] }`
        expect(() => {
            new Tokenizer(source).lexer()
        }).toThrowError()
    })

    it('lexer', () => {
        const source = `int add(){
            int a = 10;
            float b = 10.1;
            printf("Hello World");
        }`
        const tokens = new Tokenizer(source).lexer()
        expect(tokens).toStrictEqual([
            ['KEYWORD', 'int'],
            ['IDENTIFIER', 'add'],
            ['OPERATOR', '('],
            ['OPERATOR', ')'],
            ['OPERATOR', '{'],
            ['KEYWORD', 'int'],
            ['IDENTIFIER', 'a'],
            ['OPERATOR', '='],
            ['NUMBER', '10'],
            ['OPERATOR', ';'],
            ['KEYWORD', 'float'],
            ['IDENTIFIER', 'b'],
            ['OPERATOR', '='],
            ['NUMBER', '10.1'],
            ['OPERATOR', ';'],
            ['IDENTIFIER', 'printf'],
            ['OPERATOR', '('],
            ['STRING', 'Hello World'],
            ['OPERATOR', ')'],
            ['OPERATOR', ';'],
            ['OPERATOR', '}']
        ])
    })
})

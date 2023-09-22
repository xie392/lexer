import Position from './pos'
import TokenizerImpl from '../tokenizer/tokenizer'

class ParserImpl {
    private pos: Position
    // private ast: any

    constructor(source: string) {
        const tokens = new TokenizerImpl(source).lexer()
        this.pos = new Position(tokens)
        this.parser()
    }

    parser() {
        this.pos.read(() => {
            console.log('this.pos: ', this.pos.token)
        })
    }

    // private addAst(ast: any) {
    //     // this.ast
    // }
}

class processImpl {}

export function createParser(source: string) {
    return new ParserImpl(source)
}

export default ParserImpl

import Tokenizer, { Token } from '../tokenizer'
import type { Program } from './type'
import ProcessImpl from './process'
import { AST } from '../shared'

class Parser {
    private tokens: Token[]
    private program: Program
    private index: number
    private token: Token | []

    constructor(source: string) {
        this.tokens = new Tokenizer(source).lexer()
        this.program = { type: AST.PROGRAM, body: [] }
        this.index = 0
        this.token = []
        this.parser()
    }

    get isEOF() {
        return this.index > this.program.body.length
    }

    get type() {
        return this.token[0]
    }

    get value() {
        return this.token[1]
    }

    next() {
        this.token = this.tokens[this.index++]
        return this.token
    }

    parser() {
        const process = new ProcessImpl(this)
        process.process()
    }
}

export default Parser

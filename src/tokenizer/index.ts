import { removeComment, TokenType } from '../shared'
import ProccessImpl from './process'

export type Token = [TokenType, string]

export interface Stream {
    char: string
    index: number
}

class Tokenizer {
    private tokens: Token[]
    private index: number
    private source: string
    private stream: Stream

    constructor(source: string) {
        this.tokens = []
        this.index = 0
        this.source = removeComment(source)
        this.stream = { char: '', index: 0 }
    }

    get isEOF() {
        return this.index > this.source.length
    }

    get pos() {
        return this.stream
    }

    next() {
        this.stream.char = this.source[this.index++]
        this.stream.index++
        return this.stream
    }

    // skipLine() {
    //     if (isWhiteSpace(this.stream.char) && isLine(this.stream.char)) {
    //         this.stream.index = 0
    //     }
    // }

    lexer() {
        const proccess = new ProccessImpl(this)
        this.tokens = proccess.process()
        this.tokens = this.tokens.filter((token) => token[0] !== TokenType.WHITESPACE)
        return this.tokens
    }
}

export default Tokenizer

import type { Token } from '../tokenizer'

export interface Stream {
    index: number
    token: Token | null
}

class Position {
    private tokens: Token[]
    private stream: Stream

    constructor(tokens: Token[]) {
        this.tokens = tokens
        this.stream = {
            index: 0,
            token: null
        }
    }

    get token() {
        return this.stream.token
    }

    get isEOF() {
        return this.stream.index > this.tokens.length
    }

    getprevToken(index: number = 1) {
        return this.tokens[this.stream.index - index]
    }

    next() {
        this.stream.token = this.tokens[this.stream.index++]
        return this.stream.token
    }

    back(step: number = 1) {
        const index = this.stream.index
        this.stream.token = this.tokens[index === 0 ? index : this.stream.index--]
        return this.stream.token
    }

    read(cb: () => void) {
        if (this.isEOF) return
        this.next() && cb()
        this.read(cb)
    }
}

export default Position

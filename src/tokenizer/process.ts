import Tokenizer from './index'
import {
    TokenType,
    processType,
    isIdentifier,
    isWhiteSpace,
    isKeyWords,
    isNumberOrPoint,
    isOverLen,
    isOperators,
    isStringSymbol,
    processBrackets,
    isBracket
} from '../shared'

export type Token = [TokenType, string]

interface Stream {
    char: string
    value: string
    next: boolean
}

class ProccessImpl {
    private tokenizer: Tokenizer
    private tokens: Token[]
    private stream: Stream
    private brackets: string[]

    constructor(tokenizer: Tokenizer) {
        this.tokenizer = tokenizer
        this.tokens = []
        this.stream = { char: '', value: '', next: true }
        this.brackets = []
    }

    /**
     * Processes the input stream and returns an array of tokens.
     *
     * @return {Array<[TokenType, string]>} An array of tokens.
     */
    process() {
        this.stream.char = this.stream.value = ''
        this.stream.next && this.tokenizer.next()
        this.stream.next = true
        this.stream.char = this.tokenizer.pos.char

        let type = processType(this.stream.char)
        switch (type) {
            case TokenType.WHITESPACE:
                break
            case TokenType.NUMBER:
                this.processNumber()
                break
            case TokenType.OPERATOR:
                this.processOperator()
                break
            case TokenType.IDENTIFIER:
                this.processIdentifier()
                type = isKeyWords(this.stream.value?.trim())
                    ? TokenType.KEYWORD
                    : TokenType.IDENTIFIER
                break
            case TokenType.STRING:
                this.processString()
                break
            default:
                throw new Error(`Unknown token type: ${type}`)
        }

        if (this.stream.value) this.tokens.push([type, this.stream.value?.trim()])
        if (!this.tokenizer.isEOF) {
            this.process()
        }

        // check brackets
        if (!processBrackets(this.brackets)) {
            throw new Error(`Missing brackets "{" | "[" | "(" | ")" | "]" | "}"`)
        }

        return this.tokens
    }

    private processIdentifier() {
        this.processValue(isIdentifier)
    }

    private processNumber() {
        this.processValue(isNumberOrPoint)
        if (isOverLen(this.stream.value))
            throw new Error(`Too many '.' in number ${this.stream.value}`)
    }

    private processOperator() {
        this.stream.value = this.stream.char
        this.tokenizer.next()
        if (isBracket(this.stream.value)) this.brackets.push(this.stream.value)
        if (isOperators(this.stream.value  + this.tokenizer.pos.char)) {
            this.stream.value += this.tokenizer.pos.char
        } else {
            this.stream.next = false
        }
    }

    private processString() {
        this.stream.value = this.stream.char = ''
        this.tokenizer.next()
        this.processValue(isStringSymbol, true)
    }

    private processValue(isEOF: (char: string) => boolean, next: boolean = false) {
        for (;;) {
            if (!isEOF(this.tokenizer.pos.char) || this.tokenizer.isEOF) break
            this.stream.value += this.tokenizer.pos.char ?? ''
            this.tokenizer.next()
        }

        if (!isWhiteSpace(this.tokenizer.pos.char)) {
            this.stream.next = next
        }
    }
}

export default ProccessImpl

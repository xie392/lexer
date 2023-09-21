import { TokenType } from './constants'
import Position from './pos'
import {
    isBrackets,
    isDoubleOperator,
    isIdentifier,
    isKeyWords,
    isNumber,
    isOperator,
    isPoint,
    isString,
    isStringSymbol,
    isWhiteSpace,
    removeComment
} from './helper'

export interface TokenizerImplOptions {}

type Type = TokenType[keyof TokenType]

export interface Token {
    type: Type
    value: string
    pos: { line: number; column: number }
}

const STREAM = {
    CHAR: '',
    BACK: false,
    VALUE: ''
}

class TokenizerImpl {
    private position: Position
    private options?: TokenizerImplOptions
    private tokens: Token[] = []
    private brackets: string[] = []

    get pos() {
        return this.position
    }

    /**
     * 词法分析器
     * @param {string} source    源代码
     * @param {TokenizerImplOptions} options 可选参数 // TODO: 可能后续会增加
     */
    constructor(source: string, options?: TokenizerImplOptions) {
        this.position = new Position(removeComment(source))
        // this.options = options
    }

    lexer() {
        const process = new processImpl(this)
        this.position.read(() => {
            STREAM.VALUE = STREAM.CHAR = ''
            const token = process.process()
            this.addToken(token.type, token.value)
        })

        if (!processBrackets(this.brackets)) {
            this.pos.toErrorPosition(`Missing brackets`, `"{" | "[" | "(" | ")" | "]" | "}"`)
        }

        const tokens = this.tokens.filter((token) => token.type !== TokenType.SPACE)
        console.log('tokens: ', tokens)
        return tokens
    }

    setBrackets(char: string) {
        this.brackets.push(char)
    }

    private addToken(type: Type, value: string) {
        this.tokens.push({
            type,
            value,
            pos: { line: this.position.line, column: this.position.column }
        })
    }
}

class processImpl {
    private tokenizer: TokenizerImpl

    constructor(tokenizer: TokenizerImpl) {
        this.tokenizer = tokenizer
    }

    process() {
        let type = processType(this.tokenizer.pos.char)

        // DFA (Deterministic Finite Automaton)
        switch (type) {
            case TokenType.SPACE:
                break
            case TokenType.NUMBER:
                this.processNumber()
                break
            case TokenType.OPERATOR:
                this.processOperator()
                break
            case TokenType.IDENTIFIER:
                this.processIdentifier()
                type = isKeyWords(STREAM.VALUE) ? TokenType.KEYWORD : TokenType.IDENTIFIER
                break
            case TokenType.STRING:
                this.processString()
                break
            default:
                this.tokenizer.pos.toErrorPosition()
        }

        return { type, value: STREAM.VALUE }
    }

    private processNumber() {
        const fn = (char: string) => isNumber(char) || isPoint(char)
        this.processValue(fn)
        const dotCount = (STREAM.VALUE.match(/\./g) || []).length

        if (dotCount > 1) this.tokenizer.pos.toErrorPosition(`Too many '.' in number`, STREAM.VALUE)
    }

    private processOperator() {
        STREAM.VALUE = this.tokenizer.pos.char

        if (isBrackets(STREAM.VALUE)) this.tokenizer.setBrackets(STREAM.VALUE)

        STREAM.CHAR = this.tokenizer.pos.next()
        if (isDoubleOperator(STREAM.CHAR + STREAM.CHAR)) {
            STREAM.VALUE += STREAM.CHAR
            return
        }
        this.tokenizer.pos.back()
    }

    private processIdentifier() {
        this.processValue(isIdentifier)
    }

    private processString() {
        const symbol = this.tokenizer.pos.char // '"' or "'""
        const line = this.tokenizer.pos.line
        for (;;) {
            STREAM.CHAR = this.tokenizer.pos.next()
            if (isStringSymbol(STREAM.CHAR, symbol) || this.tokenizer.pos.isEOF) break
            STREAM.VALUE += STREAM.CHAR
        }

        if (line !== this.tokenizer.pos.line) {
            this.tokenizer.pos.toErrorPosition(`Unclosed string`, STREAM.VALUE)
        }
    }

    private processValue(fn: (char: string) => boolean) {
        STREAM.CHAR = this.tokenizer.pos.char
        for (;;) {
            if (!fn(STREAM.CHAR) || this.tokenizer.pos.isEOF) break
            STREAM.VALUE += STREAM.CHAR
            STREAM.CHAR = this.tokenizer.pos.next()
        }
        if (!STREAM.VALUE) STREAM.VALUE = STREAM.CHAR
        if (!this.tokenizer.pos.isEOF) this.tokenizer.pos.back()
    }
}

function processType(char: string) {
    if (isWhiteSpace(char)) return TokenType.SPACE
    if (isNumber(char)) return TokenType.NUMBER
    if (isOperator(char)) return TokenType.OPERATOR
    if (isIdentifier(char)) return TokenType.IDENTIFIER
    if (isString(char)) return TokenType.STRING
    return TokenType.NULL
}

function processBrackets(char: string[]) {
    const stack = []
    if (char.length % 2 !== 0) return false
    for (let i = 0; i < char.length; i++) {
        const c = char[i]
        if (['{', '[', '('].includes(c)) stack.push(c)
        if (['}', ']', ')'].includes(c)) stack.pop()
    }
    return stack.length === 0
}

export function createTokenizer(source: string, options?: TokenizerImplOptions) {
    return new TokenizerImpl(source, options)
}

export default TokenizerImpl

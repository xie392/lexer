import { TokenType } from './constants'
import Position from './pos'
import {
    isDoubleOperator,
    isIdentifier,
    isKeyWords,
    isNumber,
    isOperator,
    isString,
    isWhiteSpace
} from './helper'

export interface TokenizerImplOptions {}

type Type = TokenType[keyof TokenType]

export interface Token {
    type: Type
    value: string
    pos: { line: number; column: number }
}

let newChar: string
let oldChar: string

// enum Char {
//     NEW_CH = 'NEW_CH',
//     OLD_CH = 'OLD_CH'
// }

// const char = new Map<Char, string>([
//     [Char.NEW_CH, ''],
//     [Char.OLD_CH, '']
// ])

const CHAR = {
    OLDCHAR: '',
    NEWCHAR: ''
}
class TokenizerImpl {
    private _pos: Position
    private options?: TokenizerImplOptions
    private tokens: Token[] = []

    get stream() {
        return this._pos.stream
    }

    get pos() {
        return this._pos
    }

    /**
     * 词法分析器
     * @param {string} source    源代码
     * @param {TokenizerImplOptions} options 可选参数 // TODO: 可能后续会增加
     */
    constructor(source: string, options?: TokenizerImplOptions) {
        this._pos = new Position(source)
        // this.options = options
    }

    read(cb: () => void) {
        if (this._pos.isEOF()) return
        CHAR.NEWCHAR = CHAR.OLDCHAR = ''
        this._pos.next() && cb()
        this.read(cb)
    }

    lexer() {
        const process = new processImpl(this)
        this.read(() => {
            console.log('char', this.stream.char)
            const token = process.process()
            this.addToken(token.type, token.value)
        })

        console.log('tokens: ', this.tokens)

        return this.tokens
    }

    private addToken(type: Type, value: string) {
        this.tokens.push({
            type,
            value,
            pos: { line: this.stream.line, column: this.stream.column }
        })
    }
}

class processImpl {
    private tokenizer: TokenizerImpl

    constructor(tokenizer: TokenizerImpl) {
        this.tokenizer = tokenizer
    }

    process() {
        let type = processType(this.tokenizer.stream.char)
        let value = ''
        if (type === TokenType.NULL) this.processWhiteSpace()

        switch (type) {
            case TokenType.NUMBER:
                value = this.processNumber()
                break
            case TokenType.OPERATOR:
                value = this.processOperator()
                break
            case TokenType.IDENTIFIER:
                value = this.processIdentifier()
                type = isKeyWords(value)
                    ? TokenType.KEYWORD
                    : TokenType.IDENTIFIER
                break
            case TokenType.STRING:
                value = this.processString()
                break
            default:
                // throw new Error(
                //     `Unknown char: ${this.char} at ${this.pos.toString()}`
                // )
                break
        }

        return { type, value }
    }

    processWhiteSpace() {
        while (
            isWhiteSpace(this.tokenizer.stream.char) &&
            !this.tokenizer.pos.isEOF()
        ) {
            this.tokenizer.pos.next()
        }
    }

    processNumber() {
        return ''
    }

    processOperator() {
        // oldChar = this.tokenizer.char
        // while (this.isNext() && isOperator(oldChar)) {
        //     newChar += oldChar
        //     oldChar = this.tokenizer.pos.next()
        // }
        // console.log('newChar: ', newChar, 'oldChar: ', oldChar)
        return newChar
    }

    processIdentifier() {
        CHAR.OLDCHAR = this.tokenizer.stream.char
        while (this.isNext() && isIdentifier(CHAR.OLDCHAR)) {
            CHAR.NEWCHAR += CHAR.OLDCHAR
            CHAR.OLDCHAR = this.tokenizer.pos.next()
        }
        return CHAR.NEWCHAR
    }

    processString() {
        return ''
    }

    private isNext() {
        return !isWhiteSpace(oldChar) && !this.tokenizer.pos.isEOF()
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

export default TokenizerImpl

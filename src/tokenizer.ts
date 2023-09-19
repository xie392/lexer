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
} from './shared'

export interface TokenizerImplOptions {}

// type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type TypeToken = TokenType[keyof TokenType]

export interface Token {
    type: TypeToken
    value: string
    pos: { line: number; column: number }
}

class TokenizerImpl {
    private pos: Position
    private options?: TokenizerImplOptions
    private tokens: Token[] = []
    private char: string = ''

    constructor(source: string, options?: TokenizerImplOptions) {
        this.pos = new Position({ source })
        // TODO: 后续可能会扩展参数
        this.options = options
    }

    getPos() {
        return this.pos
    }

    lexer() {
        this.char = this.pos.next()
        const pro = new processImpl(this)
        while (!this.pos.isEOF()) {
            // const token = processType(this.char, this)
            const token = pro.process()
            this.addToken(token.type, token.value)
        }

        console.log('tokens: ', this.tokens)

        return this.tokens
    }

    private addToken(type: TypeToken, value: string) {
        this.tokens.push({
            type,
            value,
            pos: { line: this.pos.getLine(), column: this.pos.getColumn() }
        })
    }

    public getChar() {
        return this.char
    }

    public setChar(char: string) {
        this.char = char
    }
}

class processImpl {
    private tokenizer: TokenizerImpl
    private pos: Position
    private char: string

    constructor(tokenizer: TokenizerImpl) {
        this.tokenizer = tokenizer
        this.pos = tokenizer.getPos()
        this.char = tokenizer.getChar()
    }

    process() {
        const type = this.processType()
        let value = ''

        /**
         * DFA 有限状态机
         * 根据不同的类型,调用不同的方法
         */
        switch (type) {
            case TokenType.SPACE:
                value = this.processWhiteSpace()
                break
            case TokenType.NUMBER:
                value = this.processNumber()
                break
            case TokenType.OPERATOR:
                value = this.processOperator()
                break
            case TokenType.IDENTIFIER:
                value = this.processIdentifier()
                break
            case TokenType.STRING:
                value = this.processString()
                break
            default:
                throw new Error(
                    `Unknown char: ${this.char} at ${this.pos.toString()}`
                )
        }
        return { type, value }
    }

    processType() {
        const char = this.char
        // 空白字符
        if (isWhiteSpace(char)) return TokenType.SPACE
        // 数字
        if (isNumber(char)) return TokenType.NUMBER
        // 操作符
        if (isOperator(char)) return TokenType.OPERATOR
        // 标识符
        if (isIdentifier(char)) return TokenType.IDENTIFIER
        // 字符串
        if (isString(char)) return TokenType.STRING

        return TokenType.NULL
    }

    /**
     * TODO: 实现以下方法
     * @returns
     */
    processNumber() {
        return ''
    }
    processString() {
        return ''
    }
    processOperator() {
        return ''
    }
    processIdentifier() {
        return ''
    }
    processWhiteSpace() {
        return ''
    }
}

// function processNumber(char: string, impl: TokenizerImpl) {
//     let val = char,
//         str = char
//     const pos = impl.getPos()
//     while (isNumber(char) && !pos.isEOF()) {
//         str = pos.next()
//         val += str
//     }

//     // !isWhiteSpace(str) && pos.back()
//     return val.trim()
// }

// function processIdentifier(impl: TokenizerImpl) {
//     let val = impl.getChar()
//     const pos = impl.getPos()

//     while (
//         !isWhiteSpace(impl.getChar()) &&
//         isIdentifier(impl.getChar()) &&
//         !pos.isEOF()
//     ) {
//         val += impl.getChar()
//         impl.setChar(pos.next())
//     }

//     // 要回退一个字符
//     // !isWhiteSpace(str) && pos.back()

//     console.log('val: ', val)

//     return val
// }

// function processOperator(char: string, impl: TokenizerImpl) {
//     // console.log('processOperator', char)
//     let val = char,
//         str = ''
//     const pos = impl.getPos()
//     str += pos.next()

//     if (isDoubleOperator(val + str)) {
//         val += str
//     }

//     // 要回退一个字符
//     // !isWhiteSpace(str) && pos.back()

//     return val.trim()
// }

// function processWhiteSpace(char: string, impl: TokenizerImpl) {
//     const pos = impl.getPos()
//     while (isWhiteSpace(char) && !pos.isEOF()) {
//         pos.next()
//     }
// }

// function processType(char: string, impl: TokenizerImpl) {
//     const token: Optional<Token, 'pos'> = {
//         type: TokenType.NULL,
//         value: 'null'
//     }
//     // DFA 有限状态机
//     if (isWhiteSpace(char)) {
//         processWhiteSpace(char, impl)
//     } else if (isNumber(char)) {
//         token.value = processNumber(char, impl)
//         token.type = TokenType.NUMBER
//     } else if (isOperator(char)) {
//         token.value = processOperator(char, impl)
//         token.type = TokenType.OPERATOR
//     } else if (isIdentifier(char)) {
//         token.value = processIdentifier(char, impl)
//         token.type = isKeyWords(token.value)
//             ? TokenType.KEYWORD
//             : TokenType.IDENTIFIER
//     }

//     return token
// }

export function createTokenizer(
    source: string,
    options?: TokenizerImplOptions
) {
    return new TokenizerImpl(source, options)
}

export default TokenizerImpl

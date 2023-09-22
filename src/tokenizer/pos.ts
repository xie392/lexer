import { isLineBreak, isWhiteSpace } from '../shared'

export interface Stream {
    char: string
    index: number
    line: number
    column: number
}

/**
 * Read stream
 * @param {string} source code
 * @example
 * const pos = new Position('hello')
 * console.log(pos.next())  // h
 */
class Position {
    private source: string
    private stream: Stream
    private oldColumn: number = 0

    constructor(source: string) {
        this.source = source
        this.stream = {
            char: '',
            index: 0,
            line: 1,
            column: 0
        }
    }

    get char() {
        return this.stream.char
    }

    get line() {
        return this.stream.line
    }

    get column() {
        return this.stream.column
    }

    get prevChar() {
        return this.source[this.stream.index - 1]
    }

    get isEOF() {
        return this.stream.index > this.source.length
    }

    getPrevChar(index: number = 1) {
        return this.source[this.stream.index - index]
    }

    next() {
        this.skipLine()
        this.stream.char = this.source[this.stream.index++]
        this.stream.column++
        return this.stream.char
    }

    back(step: number = 1) {
        const index = this.stream.index
        this.stream.char = this.source[index === 0 ? index : this.stream.index--]
        this.skipLine(true)
        return this.char
    }

    read(cb: () => void) {
        if (this.isEOF) return
        this.next() && cb()
        this.read(cb)
    }

    private skipLine(isBack: boolean = false) {
        if (isWhiteSpace(this.stream.char) && isLineBreak(this.stream.char)) {
            if (!isBack) {
                this.oldColumn = this.stream.column
                this.stream.column = 0
                this.stream.line++
            } else {
                this.stream.column = this.oldColumn
                this.stream.line--
            }
        }
    }

    toString() {
        return `${this.stream.line}:${this.stream.column}`
    }

    toErrorPosition(message: string = '', value: string = this.getPrevChar()) {
        throw new Error(
            `Unexpected character: ${message} "${value}" at ${this.stream.line}:${this.stream.column}`
        )
    }
}

export default Position

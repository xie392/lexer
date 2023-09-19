import { isLineBreak, isWhiteSpace } from './shared'

export interface PositionOptions {
    source: string
    line?: number
    column?: number
}

class Position {
    private source: string
    private line: number
    private column: number
    private char: string
    private index: number
    private oldColumn: number = 0

    constructor(options: PositionOptions) {
        this.source = options.source
        this.line = options.line || 1
        this.column = options.column || 0
        this.char = ''
        this.index = -1
    }

    getLine() {
        return this.line
    }

    getColumn() {
        return this.column
    }

    next() {
        this.column++
        this.index++
        this.char = this.source[this.index]
        this.skipLine()
        return this.char
    }

    back() {
        this.index = this.index === 0 ? 0 : this.index--
        this.column = this.column === 0 ? this.oldColumn : this.column--
        this.char = this.source[this.index]
        return this.char
    }

    isEOF() {
        return this.index >= this.source.length - 1
    }

    skipLine() {
        // 跳过空格
        if (isWhiteSpace(this.char)) {
            // 换行时修改行号和列号
            if (isLineBreak(this.char)) {
                this.oldColumn = this.column
                this.column = 0
                this.line++
            }
        }
    }

    toString() {
        return `${this.line}:${this.column}
    }
}

export default Position

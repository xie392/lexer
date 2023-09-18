import { isWhiteSpace } from "./shared"

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

    /**
     * 步进器
     * 每次调用next()方法,返回下一个字符
     * @returns string
     */
    next():string {
        this.column++
        this.index++
        this.char = this.source[this.index]
        if (isWhiteSpace(this.char)) {
            if (this.char === '\n') {
                this.column = 0
                this.line++
            }
            return this.next()
        }
        return this.char
    }

    /**
     * 回退一个字符
     * @returns string
     */
    back():string {
        this.index--
        this.column--
        this.char = this.source[this.index]
        console.log('char',this.char,this.index);
        
        return this.char
    }

    isEOF() {
        return this.index >= this.source.length
    }

}

export default Position

import { isLineBreak, isWhiteSpace } from './helper'

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
    private _stream: Stream

    constructor(source: string) {
        this.source = source
        this._stream = {
            char: '',
            index: 0,
            line: 0,
            column: 0
        }
    }

    get stream() {
        return this._stream
    }

    next() {
        this.skipLine()
        this._stream.char = this.source[this._stream.index++]
        this._stream.column++
        return this._stream.char
    }

    // back(step: number = 1) {
    //     this.index = this.index === 0 ? 0 : this.index - step
    //     this._column = this.column === 0 ? this.oldColumn : this.column - step
    //     console.log('index-- end: ', this.index)
    //     this._char = this.source[this.index]
    //     return this.char
    // }

    isEOF() {
        return !(this._stream.index <= this.source.length)
    }

    private skipLine() {
        if (isWhiteSpace(this._stream.char) && isLineBreak(this._stream.char)) {
            this._stream.column = 0
            this._stream.line++
        }
    }

    toString() {
        return `${this._stream.line}:${this._stream.column}`
    }

}

export default Position

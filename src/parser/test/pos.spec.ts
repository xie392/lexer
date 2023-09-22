import Position from '../pos'

describe('parser pos', () => {
    it('next', () => {
        const tokens = [
            { type: 'keyword', value: 'int', pos: { line: 1, column: 4 } },
            { type: 'identifier', value: 'a', pos: { line: 1, column: 7 } },
            { type: 'operator', value: '=', pos: { line: 1, column: 10 } },
            { type: 'number', value: '1', pos: { line: 1, column: 13 } },
            { type: 'operator', value: ';', pos: { line: 1, column: 15 } }
        ]
        const pos = new Position(tokens)
    })
})

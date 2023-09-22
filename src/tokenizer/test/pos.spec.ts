import Position from '../pos'

describe('pos',()=> {

    it('next',()=>{
        const source = `he
o`
        const pos = new Position(source)
        let char = pos.next()
        expect(char).toBe('h')

        char = pos.next()
        expect(char).toBe('e')

        char = pos.next()

        char = pos.next()

        expect(char).toBe('o')

    })
})
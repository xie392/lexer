import Position from '../pos'

describe('pos',()=> {

    // it('next',()=>{
    //     const source = `hello`
    //     const pos = new Position({source})
    //     let char = pos.next()
    //     expect(char).toBe('h')

    //     char = pos.next()
    //     expect(char).toBe('e')

    //     char = pos.next()
    //     expect(char).toBe('l')
    // })

    // it('line',()=>{
    //     const source = `h
    //     w`
    //     const pos = new Position({source})
    //     let char = pos.next()
    //     expect(char).toBe('h')

    //     while(!pos.isEOF()) {
    //         char = pos.next()
    //     }
    //     expect(char).toBe('w')

    //     expect(pos.getLine()).toBe(2)
    // })

//     it('column',()=>{
//         const source = `hello`
//         const pos = new Position({source})
//         pos.next()
//         expect(pos.getColumn()).toBe(1)

//         pos.next()
//         expect(pos.getColumn()).toBe(2)

//         pos.next()
//         expect(pos.getColumn()).toBe(3)

//         pos.next()
//         expect(pos.getColumn()).toBe(4)

//     })

    it('line and column',()=>{
        const source = `he
w`
        const pos = new Position({source})
        pos.next()
        
        expect(pos.getColumn()).toBe(1)
        
        pos.next()
        expect(pos.getColumn()).toBe(2)

        pos.next()  // 换行
        expect(pos.getColumn()).toBe(0)

        expect(pos.getLine()).toBe(2)
    })

//     it('back',()=>{
//         const source = `hello`
//         const pos = new Position({source})
//         const char = pos.next()
//         expect(char).toBe('h')

//         const char2 = pos.next()
//         expect(char2).toBe('e')

//         const char3 = pos.back()
//         expect(char3).toBe('h')
//     })
})
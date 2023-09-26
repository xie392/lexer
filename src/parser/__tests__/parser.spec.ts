import Parser from '../index'

describe('parser', () => {
    it.only('VariableDeclaration', () => {
        const source = `int a;`
        const parser = new Parser(source)
        const file = parser.parser()
        // expect(file).toStrictEqual({
        //     type: 'Program',
        //     body: [
        //         {
        //             type: 'VariableDeclaration',
        //             declarations: [
        //                 {
        //                     type: 'VariableDeclarator',
        //                     id: {
        //                         type: 'Identifier',
        //                         name: 'a'
        //                     },
        //                     init: null
        //                 }
        //             ],
        //             kind: 'var'
        //         }
        //     ]
        // })
    })

    it('FunctionDeclaration', () => {
        const source = `var a();`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: null
                        }
                    ],
                    kind: 'var'
                },
                {
                    type: 'FunctionDeclaration',
                    params: [],
                    body: {
                        type: 'BlockStatement',
                        body: []
                    },
                    id: {
                        type: 'Identifier',
                        name: 'a'
                    }
                }
            ]
        })
    })

    it('FunctionExpression', () => {
        const source = `var a = function() {};`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: {
                                type: 'FunctionExpression',
                                params: [],
                                body: {
                                    type: 'BlockStatement',
                                    body: []
                                },
                                async: false,
                                generator: false,
                                id: null
                            }
                        }
                    ],
                    kind: 'var'
                }
            ]
        })
    })

    it('Assignment', () => {
        const source = `var a = 1;`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: {
                                type: 'Literal',
                                value: 1
                            }
                        }
                    ],
                    kind: 'var'
                }
            ]
        })
    })

    it('BinaryExpression', () => {
        const source = `var a = 1 + 2;`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: {
                                type: 'BinaryExpression',
                                operator: '+',
                                left: {
                                    type: 'Literal',
                                    value: 1
                                },
                                right: {
                                    type: 'Literal',
                                    value: 2
                                }
                            }
                        }
                    ],
                    kind: 'var'
                }
            ]
        })
    })

    it('CallExpression', () => {
        const source = `var a = foo();`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'foo'
                                },
                                arguments: []
                            }
                        }
                    ],
                    kind: 'var'
                }
            ]
        })
    })

    it('IfStatement', () => {
        const source = `var a = 1; if (a) {}`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: {
                                type: 'Literal',
                                value: 1
                            }
                        }
                    ],
                    kind: 'var'
                },
                {
                    type: 'IfStatement',
                    test: {
                        type: 'Identifier',
                        name: 'a'
                    },
                    consequent: {
                        type: 'BlockStatement',
                        body: []
                    },
                    alternate: null
                }
            ]
        })
    })

    it('ReturnStatement', () => {
        const source = `var a = 1; return a;`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: {
                                type: 'Literal',
                                value: 1
                            }
                        }
                    ],
                    kind: 'var'
                },
                {
                    type: 'ReturnStatement',
                    argument: {
                        type: 'Identifier',
                        name: 'a'
                    }
                }
            ]
        })
    })

    it('BlockStatement', () => {
        const source = `var a = 1; { }`
        const parser = new Parser(source)
        const file = parser.parser()
        expect(file).toStrictEqual({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'a'
                            },
                            init: {
                                type: 'Literal',
                                value: 1
                            }
                        }
                    ],
                    kind: 'var'
                },
                {
                    type: 'BlockStatement',
                    body: []
                }
            ]
        })
    })
})

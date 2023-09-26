import { AST, N, TokenType } from '../shared'
import Parser from './index'

class ProcessImpl {
    private parser: Parser

    constructor(parser: Parser) {
        this.parser = parser
    }

    process() {
        this.parser.next()

        if (this.parser.type === TokenType.KEYWORD) {
            return this.VariableDeclaration()
        }

        switch (this.parser.value) {
            case N.IF:
                break
            case N.FOR:
                break
            case N.WHILE:
                break
            case N.RETURN:
                break
            default:
                break
        }
    }

    private IncludeDeclaration() {
        return { type: AST.INCLUDEDECLARATION, specifiers: [] }
    }

    private VariableDeclaration() {
        return { type: AST.VARIABLEDECLARATION, declarations: [], kind: this.parser.value }
    }

    private FunctionDeclaration() {
        return { type: AST.FUNCTIONDECLARATION, params: [], body: this.BlockStatement() }
    }

    private BlockStatement() {
        return { type: AST.BLOCKSTATEMENT, body: [] }
    }

    private Expression() {}
}

export default ProcessImpl

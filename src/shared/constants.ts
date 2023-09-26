export const REG = {
    IDENTIFIER: /[a-z_$*0-9]/i,
    KEYWORD: /\b(char|const|double|float|int|sizeof|static|struct|typedef|void)\b/,
    STRING: /('|")/,
    NUMBER: /[0-9]/,
    OPERATOR: /[-+*\\/%=(){}\\[\];,.<>#]/,
    OPERATORS: /(>=|->|\+\+|--|<<|>>|<=|==|!=|&&|\|\||\+=|-=|\*=|\/=|%=|&=|\^=|\|=)/g,
    BRACKET: /[{}[\]()]/,
    WHITESPACE: /\s+/,
    COMMOENT: /\/\/.*|\/\*[\s\S]*?\*\//g,
    LINE: /\n/g
}
export enum TokenType {
    IDENTIFIER = 'IDENTIFIER',
    KEYWORD = 'KEYWORD',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    OPERATOR = 'OPERATOR',
    OPERATORS = 'OPERATORS',
    BRACKET = 'BRACKET',
    WHITESPACE = 'WHITESPACE',
    COMMOENT = 'COMMOENT',
    LINE = 'LINE'
}
export const REGEXP = new Map<TokenType, RegExp>([
    [TokenType.IDENTIFIER, REG.IDENTIFIER],
    [TokenType.KEYWORD, REG.KEYWORD],
    [TokenType.STRING, REG.STRING],
    [TokenType.NUMBER, REG.NUMBER],
    [TokenType.OPERATOR, REG.OPERATOR],
    [TokenType.OPERATORS, REG.OPERATORS],
    [TokenType.BRACKET, REG.BRACKET],
    [TokenType.WHITESPACE, REG.WHITESPACE],
    [TokenType.COMMOENT, REG.COMMOENT],
    [TokenType.LINE, REG.LINE]
])

export enum AST {
    PROGRAM = 'Program',

    VARIABLEDECLARATION = 'VariableDeclaration', // int a;
    FUNCTIONDECLARATION = 'FunctionDeclaration', // int a(){}
    INCLUDEDECLARATION = 'IncludeDeclaration', // #include <stdio.h>

    BLOCKSTATEMENT = 'BlockStatement',
    EXPRESSION = 'Expression',
}

export enum N {
    IF = 'IF',
    FOR = 'FOR',
    WHILE = 'WHILE',
    RETURN = 'RETURN',
    BREAK = 'BREAK',
    CONTINUE = 'CONTINUE',
    SWITCH = 'SWITCH',
    CASE = 'CASE',
    DEFAULT = 'DEFAULT'
}

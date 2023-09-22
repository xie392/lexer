export const KEYWORDS = new Set([
    'auto',
    'break',
    'case',
    'char',
    'const',
    'continue',
    'default',
    'do',
    'double',
    'else',
    'enum',
    'extern',
    'float',
    'for',
    'goto',
    'if',
    'int',
    'long',
    'register',
    'return',
    'short',
    'signed',
    'sizeof',
    'static',
    'struct',
    'switch',
    'typedef',
    'union',
    'unsigned',
    'void',
    'volatile',
    'while'
])
export const OPERATOR = new Set([
    '+',
    '-',
    '*',
    '/',
    '%',
    '=',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    ';',
    ',',
    '.',
    '#',
    '<',
    '>'
])
export const DOUBLE_OPERATOR = new Set([
    '>=',
    '->',
    '++',
    '--',
    '<<',
    '>>',
    '<=',
    '==',
    '!=',
    '&&',
    '||',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '&=',
    '^=',
    '|='
])
export const COMMOENT = new Set(['//', '/*', '*/'])
export const WHITESPACE = new Set([' ', '\t', '\n', '\r'])
export const BRACKETS = new Set(['{', '[', '(', ')', ']', '}'])
export const DECLARATION = new Set(['int', 'char', 'float', 'double', 'const'])

export enum TOKEN {
    STRING = 'string',
    NUMBER = 'number',
    OPERATOR = 'operator',
    KEYWORD = 'keyword',
    IDENTIFIER = 'identifier',
    NULL = 'null',
    SPACE = 'space'
}

export enum AST {
    PROGRAM = 'Program',
    EXPRESSION = 'Expression',
    DECLARATION = 'Declaration',
    BLOCKSTATEMENT = 'BlockStatement'
}

export enum TokenType {
    STRING = 'string',
    NUMBER = 'number',
    OPERATOR = 'operator',
    KEYWORD = 'keyword',
    IDENTIFIER = 'identifier',
    NULL = 'null',
    SPACE = 'space'
}
export const KEYWORDS = new Set(['int', 'double', 'float', 'return'])
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
    '.'
])
export const DOUBLE_OPERATOR = new Set(['+=', '-=', '*=', '/=', '%=', '==', '!='])
export const COMMOENT = new Set(['//', '/*', '*/'])
export const WHITESPACE = new Set([' ', '\t', '\n', '\r'])
export const BRACKETS = new Set(['{', '[', '(', ')', ']', '}'])

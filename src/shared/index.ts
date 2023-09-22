import { KEYWORDS, OPERATOR, WHITESPACE, DOUBLE_OPERATOR, BRACKETS } from './constants'

function isUndefined(char: string) {
    return char === undefined
}

export function isWhiteSpace(char: string) {
    return !isUndefined(char) && WHITESPACE.has(char)
}

export function isLineBreak(char: string) {
    return !isUndefined(char) && char === '\n'
}

export function isKeyWords(char: string) {
    return !isUndefined(char) && KEYWORDS.has(char)
}

export function isOperator(char: string) {
    return !isUndefined(char) && OPERATOR.has(char)
}

export function isDoubleOperator(char: string) {
    return !isUndefined(char) && DOUBLE_OPERATOR.has(char)
}

export function isNumber(char: string) {
    return !isUndefined(char) && /[0-9]/.test(char)
}

export function isIdentifier(char: string) {
    return !isUndefined(char) && /[_a-z0-9]/i.test(char)
}

export function isString(char: string) {
    return !isUndefined(char) && [`"`, `'`].includes(char)
}

export function isPoint(char: string) {
    return !isUndefined(char) && char === '.'
}

export function isStringSymbol(char: string, oldChar: string) {
    return char === oldChar
}

export function isBrackets(char: string) {
    return !isUndefined(char) && BRACKETS.has(char)
}

export function removeComment(str: string) {
    return str.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
}

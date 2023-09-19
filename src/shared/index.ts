import { KEYWORDS, OPERATOR, WHITESPACE, DOUBLE_OPERATOR } from './../constants'


export function isWhiteSpace(char: string) {
    return WHITESPACE.has(char)
}

export function isLineBreak(char: string) {
    return char === '\n'
}

export function isKeyWords(keyword:string) {
    return KEYWORDS.has(keyword)
}

export function isOperator(char: string) {
    return OPERATOR.has(char)
}

export function isDoubleOperator(char: string) {
    return DOUBLE_OPERATOR.has(char)
}

export function isNumber(char:string) {
    return /[0-9]/.test(char)
}


export function isIdentifier(char: string)  {
    return /[_a-z0-9]/i.test(char)
}


export function isString(char: string) {
    return [`"`, `'`].includes(char)
}

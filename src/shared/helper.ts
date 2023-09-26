import { TokenType, REGEXP } from './constants'

/**
 * Returns the regular expression associated with the given token type.
 *
 * @param {TokenType} type - The token type
 * @return {RegExp} The regular expression for the given token type
 */
export const getRegExp = (type: TokenType) => REGEXP.get(type) as RegExp

export const isIdentifier = (char: string) => getRegExp(TokenType.IDENTIFIER).test(char)
export const isKeyWords = (char: string) => getRegExp(TokenType.KEYWORD).test(char)
export const isString = (char: string) => getRegExp(TokenType.STRING).test(char)
export const isNumber = (char: string) => getRegExp(TokenType.NUMBER).test(char)
export const isOperator = (char: string) => getRegExp(TokenType.OPERATOR).test(char)
export const isOperators = (char: string) => getRegExp(TokenType.OPERATORS).test(char)
export const isBracket = (char: string) => getRegExp(TokenType.BRACKET).test(char)
export const isWhiteSpace = (char: string) => getRegExp(TokenType.WHITESPACE).test(char)
export const isLine = (char: string) => getRegExp(TokenType.LINE).test(char)
export const isComment = (char: string) => getRegExp(TokenType.COMMOENT).test(char)

/**
 * removes comment
 * @param str   string
 * @returns
 */
export const removeComment = (str: string) => str.replace(getRegExp(TokenType.COMMOENT), '')

/**
 * processes number or point
 * @param char
 * @returns
 */
export const isPoint = (char: string) => char === '.'
export const isNumberOrPoint = (char: string) => isNumber(char) || isPoint(char)
export const isOverLen = (char: string) => (char.match(/\./g) || []).length > 1

/**
 * processes string
 * @param char
 * @returns
 */
export const isStringSymbol = (char: string) => !isString(char)

/**
 * Processes a given character and returns the corresponding token type.
 *
 * @param {string} char - The character to be processed.
 * @return {string} The token type.
 */
export const processType = (char: string) => {
    if (isWhiteSpace(char)) return TokenType.WHITESPACE
    if (isNumber(char)) return TokenType.NUMBER
    if (isOperator(char)) return TokenType.OPERATOR
    if (isIdentifier(char)) return TokenType.IDENTIFIER
    if (isString(char)) return TokenType.STRING
    throw new Error(`Invalid character "${char}".`)
}

/**
 * Checks if the given array of characters represents a valid set of brackets.
 *
 * @param {string[]} char - an array of characters to be processed
 * @return {boolean} true if the brackets are balanced, false otherwise
 */
export const processBrackets = (char: string[]) => {
    const stack = []
    if (char.length % 2 !== 0) return false
    for (let i = 0; i < char.length; i++) {
        const c = char[i]
        if (['{', '[', '('].includes(c)) stack.push(c)
        if (['}', ']', ')'].includes(c)) stack.pop()
    }
    return stack.length === 0
}

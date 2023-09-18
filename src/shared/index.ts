/**
 * 判断是否是空白字符
 * @param char 字符
 * @returns boolean
 */
export function isWhiteSpace(char: string) {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

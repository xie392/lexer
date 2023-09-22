declare enum TOKEN {
    STRING = "string",
    NUMBER = "number",
    OPERATOR = "operator",
    KEYWORD = "keyword",
    IDENTIFIER = "identifier",
    NULL = "null",
    SPACE = "space"
}

interface Stream {
    char: string;
    index: number;
    line: number;
    column: number;
}
/**
 * Read stream
 * @param {string} source code
 * @example
 * const pos = new Position('hello')
 * console.log(pos.next())  // h
 */
declare class Position {
    private source;
    private stream;
    private oldColumn;
    constructor(source: string);
    get char(): string;
    get line(): number;
    get column(): number;
    get prevChar(): string;
    get isEOF(): boolean;
    getPrevChar(index?: number): string;
    next(): string;
    back(step?: number): string;
    read(cb: () => void): void;
    private skipLine;
    toString(): string;
    toErrorPosition(message?: string, value?: string): void;
}

interface TokenizerImplOptions {
}
type Type = TOKEN[keyof TOKEN];
interface Token {
    type: Type;
    value: string;
    pos: {
        line: number;
        column: number;
    };
}
declare class TokenizerImpl {
    private position;
    private options?;
    private tokens;
    private brackets;
    get pos(): Position;
    get tokensAll(): Token[];
    /**
     * 词法分析器
     * @param {string} source    源代码
     * @param {TokenizerImplOptions} options 可选参数 // TODO: 可能后续会增加
     */
    constructor(source: string, options?: TokenizerImplOptions);
    lexer(): Token[];
    setBrackets(char: string): void;
    private addToken;
}
declare function createTokenizer(source: string, options?: TokenizerImplOptions): TokenizerImpl;

export { type Stream, type Token, type TokenizerImplOptions, createTokenizer };

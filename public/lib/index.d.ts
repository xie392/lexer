declare enum TokenType {
    IDENTIFIER = "IDENTIFIER",
    KEYWORD = "KEYWORD",
    STRING = "STRING",
    NUMBER = "NUMBER",
    OPERATOR = "OPERATOR",
    OPERATORS = "OPERATORS",
    BRACKET = "BRACKET",
    WHITESPACE = "WHITESPACE",
    COMMOENT = "COMMOENT"
}

interface PosType {
    char: string;
    index: number;
}
declare class Position {
    private source;
    private index;
    private _pos;
    constructor(source: string);
    get isEOF(): boolean;
    get pos(): PosType;
    next(): PosType;
    read(cb: () => void): void;
}

type Token = [TokenType, string];
declare class Tokenizer {
    private _position;
    private tokens;
    constructor(source: string);
    get position(): Position;
    lexer(): Token[];
}

export { Tokenizer as default };

const KEYWORDS = new Set([
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
]);
const OPERATOR = new Set([
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
]);
const DOUBLE_OPERATOR = new Set([
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
]);
const WHITESPACE = new Set([' ', '\t', '\n', '\r']);
const BRACKETS = new Set(['{', '[', '(', ')', ']', '}']);
var TOKEN;
(function (TOKEN) {
    TOKEN["STRING"] = "string";
    TOKEN["NUMBER"] = "number";
    TOKEN["OPERATOR"] = "operator";
    TOKEN["KEYWORD"] = "keyword";
    TOKEN["IDENTIFIER"] = "identifier";
    TOKEN["NULL"] = "null";
    TOKEN["SPACE"] = "space";
})(TOKEN || (TOKEN = {}));
var AST;
(function (AST) {
    AST["PROGRAM"] = "Program";
    AST["EXPRESSION"] = "Expression";
    AST["DECLARATION"] = "Declaration";
    AST["BLOCKSTATEMENT"] = "BlockStatement";
})(AST || (AST = {}));

function isUndefined(char) {
    return char === undefined;
}
function isWhiteSpace(char) {
    return !isUndefined(char) && WHITESPACE.has(char);
}
function isLineBreak(char) {
    return !isUndefined(char) && char === '\n';
}
function isKeyWords(char) {
    return !isUndefined(char) && KEYWORDS.has(char);
}
function isOperator(char) {
    return !isUndefined(char) && OPERATOR.has(char);
}
function isDoubleOperator(char) {
    return !isUndefined(char) && DOUBLE_OPERATOR.has(char);
}
function isNumber(char) {
    return !isUndefined(char) && /[0-9]/.test(char);
}
function isIdentifier(char) {
    return !isUndefined(char) && /[_a-z0-9]/i.test(char);
}
function isString(char) {
    return !isUndefined(char) && [`"`, `'`].includes(char);
}
function isPoint(char) {
    return !isUndefined(char) && char === '.';
}
function isStringSymbol(char, oldChar) {
    return char === oldChar;
}
function isBrackets(char) {
    return !isUndefined(char) && BRACKETS.has(char);
}
function removeComment(str) {
    return str.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
}

/**
 * Read stream
 * @param {string} source code
 * @example
 * const pos = new Position('hello')
 * console.log(pos.next())  // h
 */
class Position {
    constructor(source) {
        this.oldColumn = 0;
        this.source = source;
        this.stream = {
            char: '',
            index: 0,
            line: 1,
            column: 0
        };
    }
    get char() {
        return this.stream.char;
    }
    get line() {
        return this.stream.line;
    }
    get column() {
        return this.stream.column;
    }
    get prevChar() {
        return this.source[this.stream.index - 1];
    }
    get isEOF() {
        return this.stream.index > this.source.length;
    }
    getPrevChar(index = 1) {
        return this.source[this.stream.index - index];
    }
    next() {
        this.skipLine();
        this.stream.char = this.source[this.stream.index++];
        this.stream.column++;
        return this.stream.char;
    }
    back(step = 1) {
        const index = this.stream.index;
        this.stream.char = this.source[index === 0 ? index : this.stream.index--];
        this.skipLine(true);
        return this.char;
    }
    read(cb) {
        if (this.isEOF)
            return;
        this.next() && cb();
        this.read(cb);
    }
    skipLine(isBack = false) {
        if (isWhiteSpace(this.stream.char) && isLineBreak(this.stream.char)) {
            if (!isBack) {
                this.oldColumn = this.stream.column;
                this.stream.column = 0;
                this.stream.line++;
            }
            else {
                this.stream.column = this.oldColumn;
                this.stream.line--;
            }
        }
    }
    toString() {
        return `${this.stream.line}:${this.stream.column}`;
    }
    toErrorPosition(message = '', value = this.getPrevChar()) {
        throw new Error(`Unexpected character: ${message} "${value}" at ${this.stream.line}:${this.stream.column}`);
    }
}

const STREAM = {
    CHAR: '',
    BACK: false,
    VALUE: ''
};
class TokenizerImpl {
    get pos() {
        return this.position;
    }
    get tokensAll() {
        return this.tokens;
    }
    /**
     * 词法分析器
     * @param {string} source    源代码
     * @param {TokenizerImplOptions} options 可选参数 // TODO: 可能后续会增加
     */
    constructor(source, options) {
        this.tokens = [];
        this.brackets = [];
        this.position = new Position(removeComment(source));
        // this.options = options
        // this.lexer()
    }
    lexer() {
        const process = new processImpl(this);
        this.position.read(() => {
            STREAM.VALUE = STREAM.CHAR = '';
            const token = process.process();
            this.addToken(token.type, token.value);
        });
        if (!processBrackets(this.brackets)) {
            this.pos.toErrorPosition(`Missing brackets`, `"{" | "[" | "(" | ")" | "]" | "}"`);
        }
        const tokens = this.tokens.filter((token) => token.type !== TOKEN.SPACE);
        // console.log('tokens: ', tokens)
        return tokens;
    }
    setBrackets(char) {
        this.brackets.push(char);
    }
    addToken(type, value) {
        this.tokens.push({
            type,
            value,
            pos: { line: this.position.line, column: this.position.column }
        });
    }
}
class processImpl {
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
    }
    process() {
        let type = processType(this.tokenizer.pos.char);
        // DFA (Deterministic Finite Automaton)
        switch (type) {
            case TOKEN.SPACE:
                break;
            case TOKEN.NUMBER:
                this.processNumber();
                break;
            case TOKEN.OPERATOR:
                this.processOperator();
                break;
            case TOKEN.IDENTIFIER:
                this.processIdentifier();
                type = isKeyWords(STREAM.VALUE) ? TOKEN.KEYWORD : TOKEN.IDENTIFIER;
                break;
            case TOKEN.STRING:
                this.processString();
                break;
            default:
                this.tokenizer.pos.toErrorPosition();
        }
        return { type, value: STREAM.VALUE };
    }
    processNumber() {
        const fn = (char) => isNumber(char) || isPoint(char);
        this.processValue(fn);
        const dotCount = (STREAM.VALUE.match(/\./g) || []).length;
        if (dotCount > 1)
            this.tokenizer.pos.toErrorPosition(`Too many '.' in number`, STREAM.VALUE);
    }
    processOperator() {
        STREAM.VALUE = this.tokenizer.pos.char;
        if (isBrackets(STREAM.VALUE))
            this.tokenizer.setBrackets(STREAM.VALUE);
        STREAM.CHAR = this.tokenizer.pos.next();
        if (isDoubleOperator(STREAM.CHAR + STREAM.CHAR)) {
            STREAM.VALUE += STREAM.CHAR;
            return;
        }
        this.tokenizer.pos.back();
    }
    processIdentifier() {
        this.processValue(isIdentifier);
    }
    processString() {
        const symbol = this.tokenizer.pos.char; // '"' or "'""
        const line = this.tokenizer.pos.line;
        for (;;) {
            STREAM.CHAR = this.tokenizer.pos.next();
            if (isStringSymbol(STREAM.CHAR, symbol) || this.tokenizer.pos.isEOF)
                break;
            STREAM.VALUE += STREAM.CHAR;
        }
        if (line !== this.tokenizer.pos.line) {
            this.tokenizer.pos.toErrorPosition(`Unclosed string`, STREAM.VALUE);
        }
    }
    processValue(fn) {
        STREAM.CHAR = this.tokenizer.pos.char;
        for (;;) {
            if (!fn(STREAM.CHAR) || this.tokenizer.pos.isEOF)
                break;
            STREAM.VALUE += STREAM.CHAR;
            STREAM.CHAR = this.tokenizer.pos.next();
        }
        if (!STREAM.VALUE)
            STREAM.VALUE = STREAM.CHAR;
        if (!this.tokenizer.pos.isEOF)
            this.tokenizer.pos.back();
    }
}
function processType(char) {
    if (isWhiteSpace(char))
        return TOKEN.SPACE;
    if (isNumber(char))
        return TOKEN.NUMBER;
    if (isOperator(char))
        return TOKEN.OPERATOR;
    if (isIdentifier(char))
        return TOKEN.IDENTIFIER;
    if (isString(char))
        return TOKEN.STRING;
    return TOKEN.NULL;
}
function processBrackets(char) {
    const stack = [];
    if (char.length % 2 !== 0)
        return false;
    for (let i = 0; i < char.length; i++) {
        const c = char[i];
        if (['{', '[', '('].includes(c))
            stack.push(c);
        if (['}', ']', ')'].includes(c))
            stack.pop();
    }
    return stack.length === 0;
}
function createTokenizer(source, options) {
    return new TokenizerImpl(source, options);
}

export { createTokenizer };

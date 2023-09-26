(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lexer = factory());
})(this, (function () { 'use strict';

    const REG = {
        IDENTIFIER: /[a-z_$*0-9]/i,
        KEYWORD: /\b(char|const|double|float|int|sizeof|static|struct|typedef|void)\b/,
        STRING: /('|")/,
        NUMBER: /[0-9]/,
        OPERATOR: /[-+*\\/%=(){}\\[\];,.<>#]/,
        OPERATORS: /(>=|->|\+\+|--|<<|>>|<=|==|!=|&&|\|\||\+=|-=|\*=|\/=|%=|&=|\^=|\|=)/g,
        BRACKET: /[{}[\]()]/,
        WHITESPACE: /\s+/,
        COMMOENT: /\/\/.*|\/\*[\s\S]*?\*\//g
        // LINE: /\n/g
    };
    var TokenType;
    (function (TokenType) {
        TokenType["IDENTIFIER"] = "IDENTIFIER";
        TokenType["KEYWORD"] = "KEYWORD";
        TokenType["STRING"] = "STRING";
        TokenType["NUMBER"] = "NUMBER";
        TokenType["OPERATOR"] = "OPERATOR";
        TokenType["OPERATORS"] = "OPERATORS";
        TokenType["BRACKET"] = "BRACKET";
        TokenType["WHITESPACE"] = "WHITESPACE";
        TokenType["COMMOENT"] = "COMMOENT";
        // LINE = 'LINE'
    })(TokenType || (TokenType = {}));
    const REGEXP = new Map([
        [TokenType.IDENTIFIER, REG.IDENTIFIER],
        [TokenType.KEYWORD, REG.KEYWORD],
        [TokenType.STRING, REG.STRING],
        [TokenType.NUMBER, REG.NUMBER],
        [TokenType.OPERATOR, REG.OPERATOR],
        [TokenType.OPERATORS, REG.OPERATORS],
        [TokenType.BRACKET, REG.BRACKET],
        [TokenType.WHITESPACE, REG.WHITESPACE],
        [TokenType.COMMOENT, REG.COMMOENT]
        // [TokenType.LINE, REG.LINE]
    ]);
    var AST;
    (function (AST) {
        AST["PROGRAM"] = "Program";
        AST["EXPRESSION"] = "Expression";
        AST["DECLARATION"] = "Declaration";
        AST["BLOCKSTATEMENT"] = "BlockStatement";
    })(AST || (AST = {}));

    /**
     * Returns the regular expression associated with the given token type.
     *
     * @param {TokenType} type - The token type
     * @return {RegExp} The regular expression for the given token type
     */
    const getRegExp = (type) => REGEXP.get(type);
    const isIdentifier = (char) => getRegExp(TokenType.IDENTIFIER).test(char);
    const isKeyWords = (char) => getRegExp(TokenType.KEYWORD).test(char);
    const isString = (char) => getRegExp(TokenType.STRING).test(char);
    const isNumber = (char) => getRegExp(TokenType.NUMBER).test(char);
    const isOperator = (char) => getRegExp(TokenType.OPERATOR).test(char);
    const isOperators = (char) => getRegExp(TokenType.OPERATORS).test(char);
    const isBracket = (char) => getRegExp(TokenType.BRACKET).test(char);
    const isWhiteSpace = (char) => getRegExp(TokenType.WHITESPACE).test(char);
    /**
     * removes comment
     * @param str   string
     * @returns
     */
    const removeComment = (str) => str.replace(getRegExp(TokenType.COMMOENT), '');
    /**
     * processes number or point
     * @param char
     * @returns
     */
    const isPoint = (char) => char === '.';
    const isNumberOrPoint = (char) => isNumber(char) || isPoint(char);
    const isOverLen = (char) => (char.match(/\./g) || []).length > 1;
    /**
     * processes string
     * @param char
     * @returns
     */
    const isStringSymbol = (char) => !isString(char);
    /**
     * Processes a given character and returns the corresponding token type.
     *
     * @param {string} char - The character to be processed.
     * @return {string} The token type.
     */
    const processType = (char) => {
        if (isWhiteSpace(char))
            return TokenType.WHITESPACE;
        if (isNumber(char))
            return TokenType.NUMBER;
        if (isOperator(char))
            return TokenType.OPERATOR;
        if (isIdentifier(char))
            return TokenType.IDENTIFIER;
        if (isString(char))
            return TokenType.STRING;
        throw new Error(`Invalid character "${char}".`);
    };
    /**
     * Checks if the given array of characters represents a valid set of brackets.
     *
     * @param {string[]} char - an array of characters to be processed
     * @return {boolean} true if the brackets are balanced, false otherwise
     */
    const processBrackets = (char) => {
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
    };

    class Position {
        constructor(source) {
            this.source = source;
            this.index = 0;
            this._pos = { char: '', index: 0 };
        }
        get isEOF() {
            return this.index > this.source.length;
        }
        get pos() {
            return this._pos;
        }
        next() {
            this._pos.char = this.source[this.index++];
            this._pos.index++;
            return this._pos;
        }
        read(cb) {
            if (this.isEOF)
                return;
            this.next() && cb();
            this.read(cb);
        }
    }

    class Tokenizer {
        constructor(source) {
            this._position = new Position(removeComment(source));
            this.tokens = [];
        }
        get position() {
            return this._position;
        }
        lexer() {
            const proccess = new ProccessImpl(this);
            this.tokens = proccess.process();
            this.tokens = this.tokens.filter((token) => token[0] !== TokenType.WHITESPACE);
            // console.log('tokens: ', this.tokens)
            return this.tokens;
        }
    }
    class ProccessImpl {
        constructor(tokenizer) {
            this.tokenizer = tokenizer;
            this.tokens = [];
            this.stream = { char: '', value: '', next: true };
            this.brackets = [];
        }
        /**
         * Processes the input stream and returns an array of tokens.
         *
         * @return {Array<[TokenType, string]>} An array of tokens.
         */
        process() {
            var _a, _b;
            this.stream.char = this.stream.value = '';
            this.stream.next && this.tokenizer.position.next();
            this.stream.next = true;
            this.stream.char = this.tokenizer.position.pos.char;
            let type = processType(this.stream.char);
            switch (type) {
                case TokenType.WHITESPACE:
                    break;
                case TokenType.NUMBER:
                    this.processNumber();
                    break;
                case TokenType.OPERATOR:
                    this.processOperator();
                    break;
                case TokenType.IDENTIFIER:
                    this.processIdentifier();
                    type = isKeyWords((_a = this.stream.value) === null || _a === void 0 ? void 0 : _a.trim())
                        ? TokenType.KEYWORD
                        : TokenType.IDENTIFIER;
                    break;
                case TokenType.STRING:
                    this.processString();
                    break;
                default:
                    throw new Error(`Unknown token type: ${type}`);
            }
            if (this.stream.value)
                this.tokens.push([type, (_b = this.stream.value) === null || _b === void 0 ? void 0 : _b.trim()]);
            if (!this.tokenizer.position.isEOF) {
                this.process();
            }
            // check brackets
            if (!processBrackets(this.brackets)) {
                throw new Error(`Missing brackets "{" | "[" | "(" | ")" | "]" | "}"`);
            }
            return this.tokens;
        }
        processIdentifier() {
            this.processValue(isIdentifier);
        }
        processNumber() {
            this.processValue(isNumberOrPoint);
            if (isOverLen(this.stream.value))
                throw new Error(`Too many '.' in number ${this.stream.value}`);
        }
        processOperator() {
            this.stream.value = this.stream.char;
            this.tokenizer.position.next();
            if (isBracket(this.stream.value))
                this.brackets.push(this.stream.value);
            if (isOperators(this.tokenizer.position.pos.char)) {
                this.stream.value += this.tokenizer.position.pos.char;
            }
            else {
                this.stream.next = false;
            }
        }
        processString() {
            this.stream.value = this.stream.char = '';
            this.tokenizer.position.next();
            this.processValue(isStringSymbol, true);
        }
        processValue(isEOF, next = false) {
            var _a;
            for (;;) {
                if (!isEOF(this.tokenizer.position.pos.char) || this.tokenizer.position.isEOF)
                    break;
                this.stream.value += (_a = this.tokenizer.position.pos.char) !== null && _a !== void 0 ? _a : '';
                this.tokenizer.position.next();
            }
            if (!isWhiteSpace(this.tokenizer.position.pos.char)) {
                this.stream.next = next;
            }
        }
    }

    return Tokenizer;

}));

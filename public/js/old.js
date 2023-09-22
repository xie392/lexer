const keywords = new Set([
  "auto",
  "break",
  "case",
  "char",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extern",
  "float",
  "for",
  "goto",
  "if",
  "int",
  "long",
  "register",
  "return",
  "short",
  "signed",
  "sizeof",
  "static",
  "struct",
  "switch",
  "typedef",
  "union",
  "unsigned",
  "void",
  "volatile",
  "while"
])
const symbols = new Set([
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  ",",
  ";",
  "#",
  "<",
  ">",
  ".",
  "\\",
  "->",
  "++",
  "--",
  "<<",
  ">>",
  "<=",
  "==",
  "!=",
  "&&",
  "||",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "&=",
  "^=",
  "|=",
  "=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "&",
  "|",
  "!",
  "?",
  ":",
])
const symbols_table = new Set([
  '{',
  '}',
  '(',
  ')',
  '[',
  ']'
])

const declaration = new Set([
  'int',
  'char',
  'float',
  'double',
  'const'
])

class C {
  constructor(input) {
    this.input = input
    this.tokens = []
    this.ast = []
  }

  tokenizer() {
    let tokenizer = new Tokenizer(this.input)
    this.tokens = tokenizer.init()
    // console.log("tokens:", this.tokens)
    return this.tokens
  }
  parser() {
    if (this.tokens.length === 0) this.tokenizer()
    let parser = new Parser(this.tokens)
    this.ast = parser.init()
    // console.log("ast部分:", this.ast)
    // console.log("ast完整:", JSON.stringify(this.ast, null, 2))
    return this.ast
  }
}

class Tokenizer {

  constructor(input) {
    this.keywords = keywords
    this.symbols = symbols
    this.symbols_table = symbols_table
    this.input = input
    this.line = 1
    this.column = -1
    this.current = 0
    this.tokens = []
    this.symbols_list = []
    this.value = null
  }

  init() {

    // 去除注释
    this.input = this.input.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
    // 去除字符串左右两边的空格,中间的空格则不做处理
    this.input = this.input.trim()

    while (this.current < this.input.length) {
      this.str = this.nextToken()
      this.tokens.push(this.tokenizer())
    }

    this.symbolsToken()

    return this.tokens
  }

  tokenizer() {

    this.skipSpace()

    // 变量/数字/关键字
    let STRING = /[_a-z0-9]/i
    if (STRING.test(this.value)) {
      const value = this.matchToken(STRING)
      return this.addToken(this.keywords.has(value) ? 'keyword' : 'identifier', value)
    }

    // 字符串
    const STRING1 = /[^"]/
    const STRING2 = /[^']/
    if ([`'`, `"`].includes(this.value)) {
      return this.addToken('string', this.value === `"` ? this.matchToken(STRING1, true) : this.matchToken(STRING2, true))
    }

    // 如果出现成对符号，就添加进符号表
    this.symbols_table.has(this.value) && this.symbols_list.push(this.value)

    // 符号
    if (this.symbols.has(this.value)) {
      const value = this.value
      const newValue = this.value + this.nextToken()

      // 双符号
      if (this.symbols.has(newValue)) {
        return this.addToken('symbol', newValue)
      }

      this.current--
      return this.addToken('symbol', value)
    }

    throw new Error(`${this.value} is no defind`)
  }

  /**
   * 移动到下一个位置
   * @param {*} isChar   是否是字符串，如果是则做特殊处理
   * @returns 
  */
  nextToken(isChar = false) {
    this.column++
    this.value = this.input[this.current]

    // 换行
    if (/(\r\n)|(\n)/.test(this.value) && this.current < this.input.length) {
      // 字符串不能换行
      if (isChar) {
        throw Error(`warning: missing terminating '${this.input[this.current - 2]}' character: ${this.line}:${this.column}`)
      }
      this.column = -1
      this.line++
      this.current++
      return this.nextToken()
    }

    return this.input[this.current++]
  }

  // 添加（用于处理最终想要的数组）
  addToken(type, value) {
    let column = this.column
    let len = value.length
    let start = column - len
    return { type, value, line: this.line, column }
  }

  /**
   * 匹配符合正则的内容
   * @param {RegExp} reg       正则表达式
   * @param {boolean} isChar   是否是字符串，如果是则做特殊处理
   * @returns 
  */
  matchToken(reg, isChar = false) {
    let token = isChar ? '' : this.value
    while (reg.test(this.nextToken(isChar)) && this.current < this.input.length) {
      token += this.value
    }
    !isChar && this.current--
    return token
  }

  symbolsToken() {
    if (this.symbols_list.length % 2 !== 0) {
      throw new Error(`符号表错误`)
    }
  }

  // 跳过空格
  skipSpace() {
    if (/\s/.test(this.value)) {
      this.value = this.nextToken()
      return this.skipSpace()
    }
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.ast = { type: "Program", body: [] }
    this.current = 0
    this.value = null
  }

  init() {
    while (this.current < this.tokens.length) {
      this.nextToken()
      this.ast.body.push(this.parser())
    }

    return this.ast
  }

  parser(flag = false) {

    let tokens = this.value

    // 处理头文件
    if (this.matchValue('#')) {
      return this.includeDeclaration()
    }

    if (this.matchType('keyword')) {

      // return 类型 
      // 1、变量/数字   => '1' 'a'
      // 2、三元表达式,表达式  => 'a+ b'  'a > 1 ? 1 : 0'
      // 3、函数(递归函数)    =>  'add(10,1)'
      // 必须以';'结尾
      if (this.matchValue('return')) {
        return this.returnStatement()
      }

      // 函数/变量声明
      // int a;
      // int a,b;
      // int a = 1;
      // int a,b = 1;
      // int a = b + 1;
      // int a = b === 1 ? 1 : 0;
      // int a[10];
      // int a[10] = {1};
      // int a()
      // int a(int a)
      // int a(int a,int b)
      // ...
      if (declaration.has(tokens.value)) {
        return this.declaration()
      }

      // 循环
      // if (this.matchValue('for')) { }

      // if (this.matchValue('while')) { }

      // if (this.matchValue('switch')) { }

      // // 判断
      // if (this.matchValue('if')) { }


    }

    console.log("遗漏tokens:", tokens)
  }

  /**
   * 查找索引位置的值
   * @param {number} next     索引跨度值
   * @param {boolean} flag    ture-增 flase-减
   * @returns {object} 
   */
  nextToken(next, flag = true) {
    if (!next) {
      this.value = this.tokens[this.current++]
      return this.value
    }
    this.current = flag ? this.current + next : this.current - next

    if (this.current > this.tokens.length) {
      throw new Error("beyond the index!")
    }
    this.value = this.tokens[this.current]
    return this.value
  }

  matchType(type) {
    return this.value?.type === type
  }

  matchValue(value) {
    return this.value?.value === value
  }

  /**
   * 声明分类，判断声明的是函数还是变量
   * @param {boolean} flag 
   * @param {boolean} params
   * @returns  
   */
  declaration(flag, params = false) {

    let declarations = []

    let tokens = this.value

    // 声明类型 int,char,double,float...
    let id = tokens.value

    if (!declaration.has(id)) {
      throw new Error(`error: '${id}' is undefined ${tokens.line}:${tokens.column}`)
    }

    const walk = () => {

      tokens = this.nextToken()

      let new_tokens = tokens

      // 检查命名是否符合规范
      if (this.matchType('identifier')) {
        let name = new_tokens.value
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) || keywords.has(name)) {
          throw new Error(`Invalid identifier name "${name}" ${tokens.line}:${tokens.column}`)
        }
      } else {
        throw new Error(`'${tokens.value}' declarations must be variables ${tokens.line}:${tokens.column}`)
      }

      tokens = this.nextToken()

      if (this.matchType('symbol')) {

        // 数组
        if (this.matchValue('[')) {

          // eslint-disable-next-line no-constant-condition
          while (true) {
            tokens = this.nextToken()
            if (this.matchValue(']') && this.current < this.tokens.length) {
              break
            }
          }
          tokens = this.nextToken()

          return { type: 'arrayExpression', id }

        }

        // 函数
        if (this.matchValue('(')) {
          return this.functionDeclaration(id, new_tokens)
        }

        // 函数有参数
        if (this.matchValue(')')) {
          this.nextToken(1, false)
          declarations.push({ type: 'identifier', name: new_tokens.value, value: undefined })
          return { type: 'variableDeclaration', declarations, id }
        }

        // 连续声明变量 int a,b,c;
        if (this.matchValue(',')) {

          declarations.push({ type: 'identifier', name: new_tokens.value, value: undefined })

          // 如果是函数参数 int add(int a,int b) => int a, int b
          if (flag) {
            tokens = this.nextToken()
            // 特殊情况 int add(int a,char b)
            // int !== char
            if (id !== tokens.value) {
              this.nextToken(1, false)
              return { type: 'variableDeclaration', declarations, id }
            }
          }

          return walk()

        }

        // 变量初始值
        if (this.matchValue('=')) {
          tokens = this.nextToken()
          declarations.push({ type: 'identifier', name: new_tokens.value, value: tokens.value })
          tokens = this.nextToken()
          if (this.matchValue(',')) {
            return walk()
          }
          return { type: 'variableDeclaration', declarations, id }
        }

        // 声明结束
        if (this.matchValue(';')) {
          declarations.push({ type: 'identifier', name: new_tokens.value, value: undefined })
          return { type: 'variableDeclaration', declarations, id }
        }

      }

      throw new Error(`'${tokens.value}' declarations must be variables ${tokens.line}:${tokens.column}`)
    }

    return walk()
  }

  /**
   * 函数声明处理
   * @param {string} id       函数声明类型
   * @param {string} options  tokens
   * @returns 
   */
  functionDeclaration(id, options) {
    let body = { type: 'blockStatement', body: [] }
    let params = []
    let tokens = this.nextToken()

    // 参数
    while (!this.matchValue(')') && this.current < this.tokens.length) {
      params.push(this.declaration(true))
      tokens = this.nextToken()
    }

    tokens = this.nextToken()

    if (this.matchValue('{')) {
      tokens = this.nextToken()
      // 函数主体内容
      while (!this.matchValue('}') && this.current < this.tokens.length) {
        body.body.push(this.parser())
        tokens = this.nextToken()
      }
    }
    return { type: 'functionDeclaration', name: options.value, body, params, id }
  }

  /**
   * 预处理文件
   * @returns 
   */
  includeDeclaration() {

    let tokens = this.nextToken()

    if (this.matchValue('include')) {

      tokens = this.nextToken()

      if (this.matchType('string')) {
        return { type: 'includeStatement', value: tokens.value }
      }

      let value = ''
      if (this.matchValue('<')) {
        tokens = this.nextToken()
        while (!this.matchValue('>')) {
          value += tokens.value
          tokens = this.nextToken()
        }
        if (value.length === 0) {
          tokens = this.nextToken(2, false)
          throw new Error(`error: empty filename in #include  ${tokens.line}:${tokens.column}`)
        }
        return { type: 'includeStatement', value }
      }
    }
    // 先不做预处理
    if (this.matchValue('define')) {
      return { type: 'defineStatement' }
    }
    if (this.matchValue('ifdef')) {
      return { type: 'defStatement' }
    }

    throw new Error(`error: invalid preprocessing directive '#${tokens.value}' ${tokens.line}:${tokens.column}`)

  }

  // return 
  returnStatement() {
    let argument = {}

    let tokens = this.nextToken()

    let value = tokens.value

    tokens = this.nextToken()

    // 变量/数字
    if (this.matchValue(';')) {
      return { type: 'returnIdentifier', value }
    }

    // 表达式
    // ...

    // 函数
    // ...

  }

  // 表达式
  expression() { }

}

class Compiler {
  constructor(language = "C", input = "") {
    let Languages = { C }
    this.lang = new Languages[language](input)
    this.input = input
  }

  tokenizer() {
    return this.lang.tokenizer();
  }
  parser() {
    return this.lang.parser();
  }
}


// const fs = require("fs")
// const path = require("path")
// const { json } = require("stream/consumers")

try {
  // 读入一个程序
  // let input = fs.readFileSync(path.resolve(__dirname, "test/main.c"), "utf8", (err, data) => { })
  const input = `
    #include <stdio.h>
    int main(){
      int a = 1;
      int b = 2;
      int c = a + b;
    }`
  let c = new Compiler("C", input)
  c.tokenizer()
  c.parser()

}
catch (err) {
  console.log(err);
}




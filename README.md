<p align="center">
    <img src="./public/accets/lintcode.svg" width="200" height="100">
</p>

<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-ES5+-blue.svg">
    <img src="https://img.shields.io/badge/Document-中文/English-orange.svg">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
</p>

<div align="center">
    <p>It is a C language lexer built using typescript</p>
    <p>Document ：<a href="/README.zh-CN.md">中文</a> / <a href="/README.md">English</a></p>
</div>

# Lexical Analyzer

A lexical analyzer (Lexer, also known as a scanner) is a part of a compiler or interpreter that breaks down the input source code string into small pieces called tokens. Each token typically represents a basic syntactical unit in the source code, such as keywords, identifiers, operators, constants, etc. Lexical analysis is the first phase of the compilation process, and its primary task is to transform complex source code strings into an easily manageable stream of tokens.

# Principles of Lexical Analyzer

The principles of a lexical analyzer are as follows:

- The lexical analyzer reads a lexical unit from the source code string.
- The lexical analyzer converts the lexical unit into a stream of tokens.

# Implementation of Lexical Analyzer

A Position class is used to represent the position of a lexical unit, which includes the line number and column number of the lexical unit. It is used to advance through lexical units. The next() method is called to get the next lexical unit. A Deterministic Finite Automaton (DFA) is used to determine different lexical units. Finally, the lexical units are converted into a stream of tokens.

# Usage of Lexical Analyzer

```shell
npm install lexers
```

```typescript
import { createTokenizer } from 'lexers'

const code = `int a = 1;`

const tokenizer = createTokenizer(code)
const tokens = tokenizer.lexer()
```

# [Playground](https://lexer-ten.vercel.app/)

<div align="center">
    <img src="./public/accets/playground.png">
</div>

# Contributions

### (1) Project Statistics

<a href="https://starchart.cc/xie392/lexer"><img src="https://starchart.cc/xie392/lexer.svg" width="700"></a>


### Q&A
If you have any problems or questions, please [submit an issue](https://github.com/xie392/lexer/issues/new)

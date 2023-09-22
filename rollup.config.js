
import ts from "rollup-plugin-typescript2"
import pkg from './package.json' assert { type: "json" }
import dts from 'rollup-plugin-dts'


export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: pkg.main,
                format: "cjs",
            },
            {
                file: pkg.module,
                format: "es",
            },
            {
                file: pkg.browser,
                format: "umd",
                name: "lexer",
            }
        ],
        plugins: [ts()],
    },
    {
        input: "src/index.ts",
        output: {
            file: 'lib/index.d.ts',
            format: "es",
        },
        plugins: [dts()]
    }
]
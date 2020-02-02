//import typescript from '@rollup/plugin-typescript';

import typescript from 'rollup-plugin-typescript2';
import html from 'rollup-plugin-bundle-html';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import pkg from "./package.json";

export default {
    input: 'src/index.ts',
    output: [
        // {
        //     file: pkg.main,
        //     format: 'cjs',
        //     exports: 'named',
        //     sourcemap: true
        // },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: true
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
    ],
    plugins: [
        typescript(), //target: "es6"
        resolve({
            rollupCommonJSResolveHack: true,
            exclude: [
                '**/__tests__/**'
            ],
            clean: true
        }),
        commonjs({
            include: ['node_modules/**']
        }),
        html({
            template: 'src/index.html',
            dest: "dist",
            filename: 'index.html',
            inject: 'head',
            externals: [],
        }),
        //serve('dist')
    ],
};
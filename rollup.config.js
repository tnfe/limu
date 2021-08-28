import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const plugins = [
  typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript'),
  }),
]
let umdOutput = {
  format: 'umd',
  name: 'limu',
  file: 'dist/limu.js',
};


if (process.env.MIN === 'true') {
  plugins.push(terser());
  umdOutput.file = 'dist/limu.min.js';
}

module.exports = {
  input: 'src/index.ts',
  plugins,
  output: [
    umdOutput,
  ],
};
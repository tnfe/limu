import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';

const plugins = [
  typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript'),
  }),
];
let umdOutput = {
  format: 'umd',
  name: 'limu',
  file: 'dist/limu.js',
};

const isCJS = process.env.CJS === 'true';
if (isCJS) {
  umdOutput.format = 'cjs';
  umdOutput.file = 'dist/limu.mjs';
}

if (process.env.MIN === 'true') {
  plugins.push(terser());
  umdOutput.file = `dist/limu.min.${isCJS ? 'mjs' : 'js'}`;
}

module.exports = {
  input: 'src/index.ts',
  plugins,
  output: [umdOutput],
};

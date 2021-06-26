import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/index.ts',
  plugins: [
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
    }), 
    // 如不想压缩，不配置 terser() 即可
    terser(),
  ],
  output: [
    {
      format: 'umd',
      name: 'limu',
      file: 'dist/limu.min.js',
      // file: 'dist/limu.js',
    },
  ],
};
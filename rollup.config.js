import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import pkgJson from './package.json';

function getSrcMajorVer() {
  const verFilePath = path.join(__dirname, './src/support/consts.ts');
  const content = fs.readFileSync(verFilePath).toString();
  const strList = content.split(os.EOL);
  const line = strList.find((item) => item.includes('LIMU_MAJOR_VER'));
  let [, verStr] = line.split('=');
  verStr = verStr.replace(/ /g, '');
  let pureVerStr = '';
  verStr.split('').forEach((char) => {
    if (new RegExp('^[0-9]*$').test(char)) {
      pureVerStr += char;
    }
  });
  const ver = parseInt(pureVerStr, 10);
  return ver;
}

function getPkgMajorVer() {
  const verStr = pkgJson.version;
  const [majorVer] = verStr.split('.');
  return parseInt(majorVer, 10);
}

const srcMajorVer = getSrcMajorVer();
const pkgMajorVer = getPkgMajorVer();
// 严格限定 v2 版本的代码只能发布 npm v2 的包体
if (srcMajorVer === 2 && srcMajorVer !== pkgMajorVer) {
  throw new Error(`src ver 2 is old arc, pkg ver [${pkgMajorVer}] can not be large than it`);
}

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

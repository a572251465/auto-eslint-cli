const path = require('path')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const typescript = require('@rollup/plugin-typescript')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const { getBabelOutputPlugin } = require('@rollup/plugin-babel')
const copy = require('rollup-plugin-copy')
const { terser } = require('rollup-plugin-terser')

const resolvePath = (url) => path.resolve(__dirname, url)

module.exports = {
  input: resolvePath('../src/index.ts'),
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'default'
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true
    }),
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      include: ['src/**/*'],
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
      plugins: ['@babel/plugin-transform-runtime']
    }),
    typescript({
      target: 'es2019',
      include: ['src/**/*.ts'],
      exclude: ['node_modules'],
      esModuleInterop: true,
      tsconfig: 'tsconfig.json',
      declaration: true,
      declarationDir: path.resolve(__dirname, 'dist/')
    }),
    commonjs({ extensions: ['.js', '.ts'], ignoreDynamicRequires: true }),
    json(),
    copy({
      targets: [{ src: 'src/cli-template', dest: 'dist' }]
    }),
    terser()
  ]
}

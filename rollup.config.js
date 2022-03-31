import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const { name } = pkg;
const inputFileName = `src/${name}.ts`;

export default [
  {
    input: inputFileName,
    output: [
      {
        file: `dist/es2015/${name}.js`,
        format: 'esm'
      }
    ],
    plugins: [
      typescript({
        removeComments: true
      })
    ]
  },
  {
    input: inputFileName,
    output: [{
      file: `dist/es2017/${name}.js`,
      format: 'esm'
    }],
    plugins: [
      typescript({
        target: 'es2017',
        removeComments: true
      })
    ]
  },
  {
    input: inputFileName,
    output: [
      { file: `dist/amd/${name}.js`, format: 'amd', amd: { id: 'aurelia-framework' } },
      { file: `dist/commonjs/${name}.js`, format: 'cjs' },
      { file: `dist/system/${name}.js`, format: 'system' },
      { file: `dist/native-modules/${name}.js`, format: 'esm' }
    ],
    plugins: [
      typescript({
        target: 'es5',
        removeComments: true
      })
    ]
  }
].map(config => {
  config.external = [
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-pal',
    'aurelia-templating',
    'aurelia-templating-resources',
    'aurelia-task-queue',
    'aurelia-logging',
    'aurelia-path',
    'aurelia-loader',
    'aurelia-metadata'
  ];
  config.output.forEach(output => output.sourcemap = true);
  config.onwarn = /** @param {import('rollup').RollupWarning} warning */ (warning, warn) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning.message);
  };
  return config;
});

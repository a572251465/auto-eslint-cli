interface IPresets {
  plugin: string
  version: string
  prefix?: string
}
const defaultPresets: IPresets[] = [
  { plugin: '@commitlint/cli', version: '^13.1.0', prefix: '^13' },
  { plugin: '@commitlint/config-angular', version: '^13.1.0', prefix: '^13' },
  { plugin: 'eslint-config-prettier', version: '^8.3.0', prefix: '^8' },
  {
    plugin: 'eslint-import-resolver-webpack',
    version: '^0.13.1',
    prefix: '^0'
  },
  { plugin: 'husky', version: '^7.0.1', prefix: '^7' },
  { plugin: 'eslint', version: '^7.32.0', prefix: '^7' },
  { plugin: 'lint-staged', version: '^11.1.2', prefix: '^11' },
  { plugin: 'prettier', version: '^2.3.2', prefix: '^2' },
  { plugin: 'eslint-plugin-import', version: '^2.24.1', prefix: '^2' },
  { plugin: 'eslint-config-airbnb-base', version: '^14.2.1', prefix: '^14' }
]

export default defaultPresets

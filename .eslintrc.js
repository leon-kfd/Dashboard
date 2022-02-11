module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    '@typescript-eslint'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
    '@vue/standard',
    '@vue/typescript/recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-eval': 'off',
    semi: 'off',
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-case-declarations': 'off',
    'no-undef': 'off',
    'no-prototype-builtins': 'off',
    camelcase: 'off',
    'vue/no-mutating-props': 'off',
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 4,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  }
}

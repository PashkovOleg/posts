module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': [2, 2],
    'quotes': ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    'semi': ['error', 'never'],
    'linebreak-style': ['error', 'windows'],
    'space-before-blocks': 1, 
    'keyword-spacing': ['warn', { 'after': true }],
    'space-infix-ops': 'warn',
    'key-spacing': ['warn', { 'afterColon': true }]
  }
}


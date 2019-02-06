module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eol-last': 0,
    'comma-dangle': ['error', 'never'],
    'import/newline-after-import': 0,
    'no-param-reassign': 0,
    'object-curly-newline': 0
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

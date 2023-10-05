/*
The provided ESLint configuration is a JavaScript object that configures ESLint, 
a tool for identifying and fixing problems in JavaScript code
*/

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      experimentalObejctRestSpread: true,
    },
  },
  rules: {
    quotes: ['error', 'single'],
    'no-console': 0,
    'no-async-promise-executor': 0,
  },
};

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks'],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { code: 1000 }],
  },
  ignorePatterns: ['src/*'],
};

const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'linebreak-style': ['error', 'unix'],
    },
  },
]);

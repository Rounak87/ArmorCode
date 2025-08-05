module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      security: require('eslint-plugin-security'),
      'no-unsanitized': require('eslint-plugin-no-unsanitized')
    },
    rules: {
      ...require('eslint-plugin-security').configs.recommended.rules,
    },
  },
];

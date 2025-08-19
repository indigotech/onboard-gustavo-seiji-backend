// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  // Any other config imports go at the top
  eslintPluginPrettierRecommended,
];

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended);

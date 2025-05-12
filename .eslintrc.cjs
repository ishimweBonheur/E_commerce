module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'react/require-default-props': 0,
    'react/self-closing-comp': 0,
    'react/jsx-props-no-spreading': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/control-has-associated-label': 0,
    'react/no-array-index-key': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['state'] },
    ],
  },
  ignorePatterns: [
    'dist/**/*',
    'postcss.config.js',
    'tailwind.config.js',
    'vite.config.ts',
    // 'EditProduct.tsx'
  ],
};

module.exports = {
  extends: ['erb', 'react-app'], // ,
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    'react/react-in-jsx-scope': 'off'
    // 'prettier/prettier': [
    //   'error',
    //   // {},
    //   // {
    //   //   usePrettierrc: false,
    //   // },
    //   {
    //     semi: false,
    //     singleQuote: true,
    //     trailingComma: 'none',
    //     jsxBracketSameLine: true,
    //   },
    // ],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts')
      },
      typescript: {}
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  }
}
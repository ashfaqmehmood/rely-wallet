module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 180,
        arrowParens: 'avoid',
        bracketSameLine: true,
        bracketSpacing: true,
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
};

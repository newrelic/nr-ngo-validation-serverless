module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'feat', 'fix', 'refactor', 'revert', 'test', 'deps'],
    ],
    'scope-empty': [2, 'always'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 10],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'lower-case'],
  },
};

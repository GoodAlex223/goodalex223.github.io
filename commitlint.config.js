module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Classic git recommendation: 72-char headers for clean git log output
    'header-max-length': [2, 'always', 72],
    // Preserve existing uppercase subject style (e.g., "docs: Add ..." not "docs: add ...")
    'subject-case': [0],
  },
};

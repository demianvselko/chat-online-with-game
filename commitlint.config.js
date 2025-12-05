module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "hotfix",
        "test",
        "docs",
        "chore",
        "refactor",
        "style",
        "ci",
        "cd",
        "performance",
        "infra",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      ["backend", "frontend", "root"],
    ],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "subject-case": [0],
  },
};
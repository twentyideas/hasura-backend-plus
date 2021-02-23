module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
  ],
  rules: {
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "no-undef": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-var-requires": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "jest/no-commented-out-tests": "off",
  },
}

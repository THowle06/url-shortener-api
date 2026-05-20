module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommend",
    "plugin:@typescript-eslint/recommend",
    "pretter",
  ],
  env: {
    node: true,
    es6: true,
  },
};

module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "airbnb-base",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2020
  },
  "rules": {
    "no-console": "off",
    "global-require": "off",
    "import/no-dynamic-require": "off",
    "strict": "off"
  }
}
      
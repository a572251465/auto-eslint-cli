module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parser: "esprima",
  rules: {
    "no-console": "off",
  },
};

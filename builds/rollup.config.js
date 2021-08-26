const path = require("path");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");
const { babel } = require("@rollup/plugin-babel");

const resolvePath = (url) => path.resolve(__dirname, url);

module.exports = {
  input: resolvePath("../src/index.ts"),
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  plugins: [
    nodeResolve(),
    babel({ babelHelpers: "bundled" }),
    typescript({
      target: "esnext",
      include: ["src/**/*.ts", "types/**"],
      esModuleInterop: true,
      tsconfig: "tsconfig.json",
      declaration: true,
      declarationDir: resolvePath("../disit"),
    }),
  ],
};

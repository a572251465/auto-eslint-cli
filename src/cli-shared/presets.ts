interface IPresets {
  plugin: string;
  version: string;
  prefix?: string;
}
interface IDefaultPresets {
  [keyname: string]: {
    value: string;
    plugins: IPresets[];
  };
}
const defaultPresets: IDefaultPresets = {
  "vue3 + ts/ vue-cli": {
    value: "vue3&ts/vue-cli",
    plugins: [
      { plugin: "@commitlint/cli", version: "^13.1.0" },
      { plugin: "@commitlint/config-angular", version: "^13.1.0" },
      { plugin: "eslint-config-prettier", version: "^8.3.0" },
      { plugin: "eslint-import-resolver-webpack", version: "^0.13.1" },
      { plugin: "husky", version: "^7.0.1" },
      { plugin: "lint-staged", version: "^11.1.2" },
      { plugin: "prettier", version: "^2.3.2" },
      { plugin: "eslint-plugin-import", version: "^2.24.1" },
      { plugin: "eslint-config-airbnb-base", version: "^14.2.1" },
    ],
  },
  "rollup + ts": {
    value: "rollup&ts",
    plugins: [],
  },
};

// 设置版本前缀
Object.keys(defaultPresets).forEach((type: string) => {
  const { plugins } = defaultPresets[type];
  plugins.forEach((item) => {
    const defail = item;
    defail.prefix = item.version.includes(".")
      ? item.version.split(".")[0]
      : item.version;
  });
});

export default defaultPresets;

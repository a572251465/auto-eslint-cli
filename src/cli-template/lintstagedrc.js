const lintstagedContent = (
  options = {}
) => `// eslint-disable-next-line import/no-extraneous-dependencies
const lintStaged = require('lint-staged');
const path = require('path');

async function startLinting() {
  try {
    const success = await lintStaged({
      allowEmpty: false,
      concurrent: true,
      config: {
        '*.${options.suffixKey}': ['eslint --ext .js,.ts .', 'prettier --check .']
      },
      debug: false,
      cwd: process.cwd(),
      maxArgLength: null,
      relative: false,
      shell: false,
      quiet: true,
      stash: true,
      verbose: false
    });

    if (success) {
      console.log('Linting was successful!');
      process.exit(0);
    } else {
      console.log('Linting failed!');
      process.exit(1);
    }
  } catch (e) {
    // Failed to load configuration
    console.error(e);
    process.exit(1);
  }
}

startLinting();
  `
module.exports = lintstagedContent

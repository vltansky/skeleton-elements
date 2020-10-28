const path = require('path');
const fs = require('fs-extra');
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

async function compileFile(fileName) {
  if (!fileName.endsWith('.scss')) {
    // skip not scss files
    return;
  }
  const src = path.resolve(__dirname, `../../src/${fileName}`);
  const output = path.resolve(
    __dirname,
    `../../package/${fileName
      .replace('skeleton-elements-core', 'skeleton-elements')
      .replace('.scss', '.css')}`,
  );
  sass.render({ file: src }, async (sassErr, sassResult) => {
    if (sassErr) {
      throw sassErr;
    }
    const result = await postcss([autoprefixer])
      .process(sassResult.css.toString(), { from: src, map: false })
      .catch((err) => {
        throw err;
      });
    result.warnings().forEach((warn) => {
      console.warn(warn.toString());
    });
    const content = result.css;
    return fs.writeFile(output, content);
  });
}

module.exports = async () => {
  const files = await fs.readdir(path.resolve(__dirname, '../../src'));
  return Promise.all(files.map((fileName) => compileFile(fileName)));
};

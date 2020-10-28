const fs = require('fs-extra');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

const sourceDir = path.resolve(__dirname, '../src');
const distDir = path.resolve(__dirname, `../package/`);

async function compileFile(fileName) {
  if (!fileName.endsWith('.scss')) {
    // skip not scss files
    return;
  }
  const src = path.join(sourceDir, fileName);
  const output = path.join(
    distDir,
    fileName
      .replace('skeleton-elements-core', 'skeleton-elements')
      .replace('.scss', '.css'),
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

async function build() {
  await fs.copy(path.join(sourceDir, 'fonts'), path.join(distDir, 'fonts')); // Copy fonts
  await fs.copy(path.join(sourceDir, 'scss'), path.join(distDir, 'scss')); // Copy scss

  // copy root modules
  await fs.copy(sourceDir, distDir, {
    filter: (fileName) => fileName.endsWith('.scss'),
  });

  const files = await fs.readdir(sourceDir);
  return Promise.all(files.map((fileName) => compileFile(fileName)));
}

build();

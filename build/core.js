const fs = require('fs-extra');
const path = require('path');
const copySCSS = require('./shared/copy-scss');
const scss = require('./shared/scss');

async function build() {
  // Copy fonts
  await fs.copy(
    path.resolve(__dirname, '../src/fonts'),
    path.resolve(__dirname, `../package/fonts`),
  );

  await copySCSS();
  await scss();
}

build();

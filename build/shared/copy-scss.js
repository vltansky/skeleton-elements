const fs = require('fs-extra');
const path = require('path');

module.exports = async () => {
  // copy sub modules
  await fs.copy(
    path.resolve(__dirname, '../../src/scss'),
    path.resolve(__dirname, `../../package/scss`),
  );

  // copy root modules
  const srcDirRoot = path.resolve(__dirname, '../../src');
  const destDirRoot = path.resolve(__dirname, `../../package/`);
  const filesRoot = await fs.readdir(srcDirRoot);
  return filesRoot.forEach(async (fileName) => {
    if (!fileName.endsWith('.scss')) {
      return;
    }
    await fs.copy(
      path.join(srcDirRoot, fileName),
      path.join(destDirRoot, fileName),
    );
  });
};

const { createHash } = require('crypto');

const checksumsFileName = '.checksums';

const fakeGitignoreFileName = '`.gitignore';

const gitignoreFileName = '.gitignore';

const templateDirectoryName = 'template';

const starterDirectoryName = 'starter';

const starterElementDirectoryName = 'customElement';

const elementsDirectoryName = 'src/routes/elements';

const samplesDirectoryName = 'samples';

const specialDirectoryName = 'special';

const newExtension = '.new';

const packageJsonFileName = 'package.json';

function getChecksumForFileAtPath(/** @type {string} */ file) {
  return createHash('sha256').update(file, 'utf8').digest('hex');
}

module.exports = {
  templateDirectoryName,
  packageJsonFileName,
  checksumsFileName,
  fakeGitignoreFileName,
  gitignoreFileName,
  specialDirectoryName,
  samplesDirectoryName,
  starterElementDirectoryName,
  elementsDirectoryName,
  starterDirectoryName,
  getChecksumForFileAtPath,
  newExtension,
};

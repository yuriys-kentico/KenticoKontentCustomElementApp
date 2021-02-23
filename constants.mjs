import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

export const checksumsFileName = '.checksums';
export const fakeGitignoreFileName = '`.gitignore';
export const gitignoreFileName = '.gitignore';
export const templateDirectoryName = 'template';
export const starterDirectoryName = 'starter';
export const starterElementDirectoryName = 'customElement';
export const elementsDirectoryName = 'src/routes/elements';
export const samplesDirectoryName = 'samples';
export const samplesDependeciesCommand = 'npm i --save tinycolor2&npm i --save-dev @types/tinycolor2';
export const specialDirectoryName = 'special';
export const newExtension = '.new';
export const packageJsonFileName = 'package.json';

export async function getChecksumForFileAtPath(/** @type {string} */ file) {
  const contents = await readFile(file, 'utf8');

  return createHash('sha256').update(contents, 'utf8').digest('hex');
}

export default {
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
  samplesDependeciesCommand,
  newExtension,
};

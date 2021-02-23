// @ts-check
import { join } from 'path';
import { writeFile, readdir, readFile } from 'fs/promises';
import constants from './constants.mjs';
import { EOL } from 'node:os';

const {
  templateDirectoryName,
  checksumsFileName,
  getChecksumForFileAtPath,
  samplesDirectoryName,
  specialDirectoryName,
  fakeGitignoreFileName,
} = constants;

(async () => {
  const contents = await readFile(checksumsFileName, 'utf8');
  const checksums = new Set(contents.split(EOL));

  await loadChecksumsForFilesInDirectoryAtPath(templateDirectoryName, checksums);
  await loadChecksumsForFilesInDirectoryAtPath(samplesDirectoryName, checksums);

  const checksum = await getChecksumForFileAtPath(join(specialDirectoryName, fakeGitignoreFileName));
  checksums.add(checksum);

  await writeFile(checksumsFileName, [...checksums].join(EOL));
})();

async function loadChecksumsForFilesInDirectoryAtPath(
  /** @type {string} */ directory,
  /** @type {Set<string>} */ checksums
) {
  const files = await readdir(directory, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const checksum = await getChecksumForFileAtPath(join(directory, file.name));

      checksums.add(checksum);
    }

    if (file.isDirectory()) {
      await loadChecksumsForFilesInDirectoryAtPath(join(directory, file.name), checksums);
    }
  }
}

// @ts-check
import { copyFile, readdir, mkdir, readFile, access, rename } from 'fs/promises';
import { basename, join } from 'path';
import jsonfile from 'jsonfile';
import constants from './constants.mjs';
import { EOL } from 'node:os';
import { exec } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';

const {
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
} = constants;
const { bgYellow, bold } = chalk;
const { merge } = lodash;

const target = process.env.INIT_CWD;
const name = process.env.kcea_name;
const samples = process.env.kcea_samples;

(async () => {
  const contents = await readFile(checksumsFileName, 'utf8');
  const checksums = new Set(contents.split(EOL));

  await installTemplates(checksums);

  if (name !== undefined) {
    await installStarter(name, checksums);
  }

  if (samples === 'true') {
    await installSamples(checksums);
  }

  await installGitIgnore(checksums);
  await mergePackageJson();

  if (samples === 'true' || (await samplesAlreadyInstalled())) {
    await installSamplesDependencies();
  }
})();

async function installTemplates(/** @type {Set<string>} */ checksums) {
  await copyDirectoryChildrenToPath(templateDirectoryName, target, checksums);
}

async function installStarter(/** @type {string} */ folderName, /** @type {Set<string>} */ checksums) {
  let exists = true;

  try {
    await access(join(target, elementsDirectoryName, folderName));
  } catch {
    exists = false;
  }

  if (exists) {
    return;
  }

  await copyDirectoryChildrenToPath(starterDirectoryName, join(target, elementsDirectoryName), checksums);
  await rename(
    join(target, elementsDirectoryName, starterElementDirectoryName),
    join(target, elementsDirectoryName, folderName)
  );
}

async function installSamples(/** @type {Set<string>} */ checksums) {
  await copyDirectoryChildrenToPath(samplesDirectoryName, join(target, elementsDirectoryName), checksums);
}

async function installGitIgnore(/** @type {Set<string>} */ checksums) {
  await copyFileToPath(join(specialDirectoryName, fakeGitignoreFileName), join(target, gitignoreFileName), checksums);
}

async function mergePackageJson() {
  let newPackageJsonPath = join(specialDirectoryName, packageJsonFileName);
  let packageJsonPath = join(target, packageJsonFileName);

  let exists = true;

  try {
    await access(packageJsonPath);
  } catch {
    exists = false;
  }

  if (!exists) {
    await copyFileToPath(newPackageJsonPath, packageJsonPath);

    const packageJson = await jsonfile.readFile(packageJsonPath);

    packageJson.name = process.env.kcea_name;

    await jsonfile.writeFile(join(target, packageJsonFileName), packageJson, { spaces: 2 });

    return;
  } else {
    const newPackageJson = await jsonfile.readFile(newPackageJsonPath);

    delete newPackageJson.name;

    const packageJson = await jsonfile.readFile(packageJsonPath);

    merge(packageJson, newPackageJson);

    await jsonfile.writeFile(packageJsonPath, packageJson, { spaces: 2 });
  }
}

async function samplesAlreadyInstalled() {
  const files = await readdir(samplesDirectoryName, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      try {
        await readdir(join(target, elementsDirectoryName, file.name));
      } catch {
        return false;
      }
    }
  }

  return true;
}

async function installSamplesDependencies() {
  const run = exec(`cd ${target}&${samplesDependeciesCommand}`);

  run.stdout.pipe(process.stdout);
  run.stderr.pipe(process.stderr);
}

async function copyFileToPath(
  /** @type {string} */ sourcePath,
  /** @type {string} */ targetPath,
  /** @type {Set<string>} */ checksums = undefined
) {
  const targetPathNew = `${targetPath}${newExtension}`;

  let exists = true;
  let checksumExists = true;

  try {
    await access(targetPath);
  } catch {
    exists = false;
  }

  if (exists && checksums) {
    checksumExists = checksums.has(await getChecksumForFileAtPath(targetPath));
  }

  if (!exists || (checksumExists && checksums)) {
    try {
      await copyFile(sourcePath, targetPath);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  if (exists && !checksumExists) {
    process.stderr.write(`${bgYellow('   ')} ${bold.redBright(`File at '${targetPath}' has been modified.`)}${EOL}`);
    process.stderr.write(
      `${bgYellow('   ')} Please manually merge changes from '${basename(targetPath)}' into '${basename(
        targetPathNew
      )}' and remove the '${newExtension}' extension.${EOL}${EOL}`
    );

    try {
      await copyFile(sourcePath, targetPathNew);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
}

async function copyDirectoryChildrenToPath(
  /** @type {string} */ source,
  /** @type {string} */ target,
  /** @type {Set<string>} */ checksums
) {
  try {
    await mkdir(target);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  const files = await readdir(source, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      await copyFileToPath(join(source, file.name), join(target, file.name), checksums);
    }

    if (file.isDirectory()) {
      await copyDirectoryChildrenToPath(join(source, file.name), join(target, file.name), checksums);
    }
  }
}

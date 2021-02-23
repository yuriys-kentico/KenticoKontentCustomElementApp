#!/usr/bin/env node
'use strict';

var { exec } = require('child_process');
const packageJson = require('./package.json');
const { green, red } = require('chalk');
const prompts = require('prompts');
const { Command } = require('commander');

const options = [
  {
    data: {
      type: 'text',
      name: 'name',
      alias: 'n',
      message: 'Name of the app:',
      description: 'Name of the app',
      initial: 'custom-element',
      validate: (value) =>
        /^[^a-z0-9]/.test(value) ? 'Please do not use a leading special or uppercase character.' : true,
      value: undefined,
    },
    valid: (value) => value !== undefined && /^[a-z0-9]/.test(value),
    sanitize: (value) =>
      value
        .toLowerCase()
        .slice(0, 214)
        .replace(/(?:@[^a-z0-9][^a-z0-9-*._~]*\/)?[^a-z0-9-~][^a-z0-9-._~]*/g, '-'),
  },
  {
    data: {
      type: 'toggle',
      name: 'samples',
      alias: 's',
      message: 'Install samples?',
      description: 'Install samples',
      active: 'yes',
      inactive: 'no',
      value: undefined,
    },
    valid: (value) => value === true || value === false,
    sanitize: (value) => new Boolean(value),
  },
  {
    data: {
      type: 'toggle',
      name: 'run',
      alias: 'r',
      message: 'Run immediately?',
      description: 'Run immediately',
      active: 'yes',
      inactive: 'no',
      value: undefined,
    },
    valid: (value) => value === true || value === false,
    sanitize: (value) => new Boolean(value),
  },
];

(async () => {
  try {
    console.log(green(`${packageJson.name} ${packageJson.version}`));
    parseCommands(options);

    await parsePrompts(options);

    sanitizeOptions(options);
    installApp(options);
  } catch (error) {
    console.log(red(error));
  }
})();

function parseCommands(/** @type {any[]} */ options) {
  let program = new Command();

  program = program.version(packageJson.version);

  for (const option of options) {
    const { alias, name, description } = option.data;

    switch (option.data.type) {
      case 'toggle':
        program = program.option(`-${alias}, --${name} [${name}]'`, description);
        program = program.option(`-${alias}, --no-${name} [${name}]'`, description);
        break;

      default:
        program = program.option(`-${alias}, --${name} [${name}]'`, description);
        break;
    }
  }

  for (const optionPair of Object.entries(program.parse().opts())) {
    const [name, option] = optionPair;

    const originalOption = options.find((option) => option.data.name === name);

    if (originalOption.valid(option)) {
      originalOption.data.value = option;
    }
  }
}

async function parsePrompts(/** @type {any[]} */ options) {
  const questions = [];

  for (const option of options) {
    if (option.data.value === undefined) {
      questions.push(option.data);
    }
  }

  if (questions.length === 0) {
    return;
  }

  const responses = await prompts(questions);

  for (const optionPair of Object.entries(responses)) {
    const [name, response] = optionPair;

    const originalOption = options.find((option) => option.data.name === name);

    if (originalOption.valid(response)) {
      originalOption.data.value = response;
    }
  }
}

function sanitizeOptions(/** @type {any[]} */ options) {
  for (const option of options) {
    if (option.data.value !== undefined) {
      try {
        option.data.value = option.sanitize(option.data.value);
      } catch (error) {
        throw error;
      }
    }
  }
}

function installApp(/** @type {any[]} */ options) {
  const variableCommands = [];
  let run = false;
  let name;

  for (const option of options) {
    variableCommands.push(`set kcea_${option.data.name}=${option.data.value}`);

    switch (option.data.name) {
      case 'run':
        if (option.data.value == true) {
          run = true;
        }
        break;

      case 'name':
        name = option.data.value;
        break;
    }
  }

  if (options.some((option) => option.data.value === undefined)) {
    return;
  }

  console.log(green('Installing app, please wait...'));

  let command = `${variableCommands.join('&')}&npm i kontent-custom-element-app -s`;

  const installChild = exec(command);

  // installChild.stdout.pipe(process.stdout);
  installChild.stderr.pipe(process.stderr);

  installChild.on('exit', (code) => {
    if (code === 0) {
      console.log(
        green(`App installed, enjoy! The starter element is available at https://localhost:3000/elements/${name}`)
      );

      if (run) {
        const runChild = exec('npm run dev');

        runChild.stdout.pipe(process.stdout);
        runChild.stderr.pipe(process.stderr);
      }
    }
  });
}

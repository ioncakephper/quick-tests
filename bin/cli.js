#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {globSync} = require('glob');
const yaml = require('js-yaml');

const {Command} = require('commander');
const program = new Command();

program
  .name('cli')
  .description('Generate tests from YAML files.')
  .argument('[pattern...]', 'Glob pattern to match YAML files.', ['**/*.yaml'])
  .option('-i, --show-invalid', 'Show invalid YAML files.')
  .action((pattern, options) => {
    const patterns = pattern;
    const {showInvalid} = options;

    const files = [];
    const invalidFiles = [];

    for (const pattern of patterns) {
      globSync(pattern).forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          yaml.load(content);
          files.push(file);
        } catch (e) {
          invalidFiles.push({file, error: e.message});
        }
      });
    }

    if (showInvalid && invalidFiles.length > 0) {
      console.error('Invalid YAML files:');
      invalidFiles.forEach(item => console.error(`- ${item.file}: ${item.error}`));
    }

    

  })

  .parse();


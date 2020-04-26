#!/usr/bin/env node

/**
 * MODULES
 */

const process = require('process');
const commander = require('commander');
const commandList = require('./src/commands');

const package = require('./package.json');
const msg = require('./src/msg');
const log = console.log;

/**
 * CLI
 */

let commandFound = false;

commander
  .version(
    package.version,
    msg.versionParam,
    msg.versionParamDescription
  );

// CLI - Commands
commandList.forEach(
  (commandInfo) => {
    commander
      .command(commandInfo.syntax)
      .description(commandInfo.description)
      .action(function () {
        if (commandFound) {
          return;
        }

        commandFound = true;

        commandInfo.action.apply(
          null,
          [
            commander.output || commandInfo.outputFilePath,
            ...arguments
          ]
        ).then(
          () => {
            log(msg.outputFile(
              commander.output || commandInfo.outputFilePath
            ));
          }
        ).catch(
          (err) => {
            log(err);
          }
        ).finally(
          () => {
            log(msg.done);
          }
        );

      });
  }
);

// CLI - Options
commander
  .allowUnknownOption()
  .option(msg.outputParam, msg.outputParamDescription)
  .option(msg.errorParam, msg.errorParamDescription);

log(msg.about(package.name, package.version));

commander.exitOverride();

try {
  commander.parse(process.argv);
}
catch (err) {
  if (err && err.exitCode === 0) {
    commandFound = true;
  }
  else if (commander.error) {
    log(msg.commandParseError(err.CommanderError));
  }
  else {
    log(msg.commandError);
  }
}

// Check if the version option is called
// to avoid displaying the commandNotFound message
const firstOption = process.argv[2];
const versionOptionFound = (
  firstOption === '-v' ||
  firstOption === '-V' ||
  firstOption === '--version'
);

if (!commandFound && !versionOptionFound) {
  log(msg.commandNotFound(package.name));
}

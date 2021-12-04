const { cmdArguments } = require('../cli/arguments');
const { usage } = require('../cli/usage');
const { run, use, help } = require('../../uucommander');

const COMMANDS = {
  COMMAND_HELP: 'help',
  COMMAND_USE: 'use',
  COMMAND_RUN: 'run'
};

const actions = {
  displayHelp: {
    condition: () => handleCondition(cmdArguments.command === COMMANDS.COMMAND_HELP || cmdArguments.help || Object.keys(cmdArguments).length === 0),
    action: async () => await help(usage)
  },
  displayConfig: {
    condition: () => handleCondition(cmdArguments.command === COMMANDS.COMMAND_USE),
    action: async () => await use(cmdArguments)
  },
  runCommands: {
    condition: () => handleCondition(cmdArguments.command === COMMANDS.COMMAND_RUN),
    action: async () => await run(cmdArguments)
  }
};

const handleCondition = (condition) => {
  if (_isKnownAction()) {
    return condition;
  }
};

const _isKnownAction = () => !cmdArguments._unknown;

module.exports = {
  actions,
  COMMANDS
};

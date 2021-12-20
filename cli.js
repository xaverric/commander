#!/usr/bin/env node
const { actions } = require('./app/cmd/actions/actions.js');
const { cmdArguments } = require('./app/cmd/cli/arguments.js');
const printFormattedJson = require('./app/util/cmdtools/printFormattedJson');

const logger = require('./config/logger');

const main = async () => {
  logger.debug(`uuCommander CLI started with arguments: ${printFormattedJson(cmdArguments)}`);
  let actionExecuted = false;
  for (const actionName of Object.keys(actions)) {
    // execute first action which meets the condition and terminate the process
    if (actions[actionName].condition()) {
      actionExecuted = true;
      await actions[actionName].action();
    }
  }
  // the process should never get here
  processErrorMessages(actionExecuted);
};

const processErrorMessages = (actionExecuted) => {
  cmdArguments._unknown && logger.warn(`Unknown arguments used: ${cmdArguments._unknown}`);
  !actionExecuted && logger.error('No action match the given parameters. uuCommander will terminate without any action performed.');
};

main().then(() => {
  process.stdin.destroy();
}).catch((e) => {
  logger.error(`Error in application : ${e.stack}`);
});

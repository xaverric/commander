#!/usr/bin/env node
const { actions } = require('./app/cmd/actions/actions.js');
const { cmdArguments } = require('./app/cmd/cli/arguments.js');

const main = async () => {
  for (const actionName of Object.keys(actions)) {
    // execute first action which meets the condition and terminate the process
    if (actions[actionName].condition()) {
      await actions[actionName].action();
      process.exit();
    }
  }
  console.warn('No action performed.');
  cmdArguments._unknown && console.log(`Unknown arguments used: ${cmdArguments._unknown}`);
};

main().then(() => {
  process.stdin.destroy();
}).catch((e) => {
  console.error(`Error in application : ${e.stack}`);
});

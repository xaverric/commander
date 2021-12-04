const { loadConfig } = require('./util/loader/configLoader');
const { loadData } = require('./util/loader/dataLoader');
const login = require('./auth/authorization');
const { callCommand } = require('./client/calls');
const printJson = require('./util/cmdtools/printFormattedJson');

/**
 * Performs command call based on the given configuration parameters
 * @param cmdArgs
 * @return {Promise<void>}
 */
const run = async (cmdArgs) => {
  const config = loadConfig(cmdArgs);
  const data = loadData(config.data);
  const token = await login(config);

  for (const dtoIn of data.itemList) {
    const result = await callCommand(config, dtoIn, token);
    console.log(`Response: ${JSON.stringify(result, null, 4)}`);
  }
};

/**
 * Displays current configuration.
 * @param cmdArgs
 */
const use = async (cmdArgs) => {
  const config = loadConfig(cmdArgs);
  console.log(printJson(config));
};

/**
 * Displays help information to the user
 * @param cmdArgs
 * @param usage
 */
const help = async (usage) => {
  console.log(usage);
};

module.exports = {
  run,
  use,
  help
};

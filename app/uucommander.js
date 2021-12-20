const { loadConfig } = require('./util/loader/configLoader');
const { loadData } = require('./util/loader/dataLoader');
const login = require('./auth/authorization');
const { callCommand } = require('./client/calls');
const printJson = require('./util/cmdtools/printFormattedJson');
const exportToOutput = require('./util/output/outputExporter');

const logger = require('../config/logger');

/**
 * Performs command call based on the given configuration parameters
 * @param cmdArgs
 * @return {Promise<void>}
 */
const run = async (cmdArgs) => {
  const config = loadConfig(cmdArgs);
  const data = loadData(config.data);
  console.log(config);
  const token = await login(config);

  for (const [index, dtoIn] of data.itemList.entries()) {
    const [dtoOut, status] = await callCommand(config, dtoIn, token);
    logger.info(`Request no.${index + 1} ended with HTTP code: ${status}`);
    logger.debug(`Response: ${JSON.stringify(dtoOut, null, 4)}`);
    cmdArgs.output && exportToOutput(cmdArgs.output, index, dtoIn, dtoOut, status);
  }
};

/**
 * Displays current configuration.
 * @param cmdArgs
 */
const use = async (cmdArgs) => {
  const config = loadConfig(cmdArgs);
  logger.info(printJson(config));
};

/**
 * Displays help information to the user
 * @param cmdArgs
 * @param usage
 */
const help = async (usage) => {
  logger.info(usage);
};

module.exports = {
  run,
  use,
  help
};

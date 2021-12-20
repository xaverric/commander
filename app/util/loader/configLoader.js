const fs = require('fs');
const path = require('path');
const validate = require('../../validation/validator');
const configurationSchemaUse = require('../../validation/configuration/schema-use');
const configurationSchemaRun = require('../../validation/configuration/schema-run');
const { CONFIG_DEFAULT_PATH, UUCOMMANDER_HOME } = require('../../../config/config');

const logger = require('./../../../config/logger');

const ALLOWED_CONFIG_ARGUMENTS = Object.keys(configurationSchemaUse);

const loadConfig = (cmdArgs = {}) => {
  const config = _loadConfigFile(cmdArgs);
  const mergedConfig = _mergeConfigurationWithCmdArguments(cmdArgs, config);
  _processConfigForCommand(cmdArgs.command, mergedConfig);
  return mergedConfig;
};

const _loadConfigFile = (cmdArgs) => {
  let data;
  try {
    if (!data) {
      data = _loadConfigFromCustomPath(cmdArgs?.config);
    }
    if (!data) {
      data = _loadConfigFromDefaultPath();
    }
    if (!data) {
      data = _loadConfigFromCmdArguments();
    }
  } catch (err) {
    logger.error(`Unexpected error occurred during configuration loading. Stacktrace: ${err}`);
  }
  return data;
};

const _loadConfigFromCustomPath = (path) => {
  let data;
  if (fs.existsSync(path)) {
    logger.debug(`Loading configuration from custom path: ${path}`);
    data = JSON.parse(fs.readFileSync(path));
  } else if (path) {
    logger.debug(`Custom path is not valid. The file does not exists. Path: ${path}`);
  }
  return data;
};

const _loadConfigFromDefaultPath = () => {
  let data;
  if (fs.existsSync(CONFIG_DEFAULT_PATH)) {
    logger.debug(`Loading configuration from default path: ${CONFIG_DEFAULT_PATH}`);
    data = JSON.parse(fs.readFileSync(CONFIG_DEFAULT_PATH));
  } else {
    logger.debug(`Configuration on default path ${CONFIG_DEFAULT_PATH} does not exist.`);
  }
  return data;
};

const _loadConfigFromCmdArguments = (cmdArguments) => {
  logger.debug('No configuration found, using command line arguments only.');
  return cmdArguments;
};

const _mergeConfigurationWithCmdArguments = (cmdArgs, config = {}) => {
  let mergedConfig;
  if (_isEnvRequested(cmdArgs)) {
    if (_isEnvInConfig(cmdArgs, config) && _isNotEmpty(cmdArgs?.environment)) {
      mergedConfig = { ...config?.environment[cmdArgs?.environment] };
    } else {
      throw new Error(`Requested environment does not exist in the configuration: '${cmdArgs?.environment}'`);
    }
  } else {
    mergedConfig = { ...config };
  }
  Object.keys(cmdArgs).forEach((argument) => {
    if (ALLOWED_CONFIG_ARGUMENTS.includes(argument)) {
      mergedConfig[argument] = cmdArgs[argument];
    }
  });
  return mergedConfig;
};

const _isEnvRequested = (cmdArgs) => Object.keys(cmdArgs).some((argument) => argument === 'environment');

const _isEnvInConfig = (cmdArgs, config) => {
  if (config?.environment) {
    return config?.environment[cmdArgs?.environment];
  }
  return false;
};

const _isNotEmpty = (value) => !!value;

const _processConfigForCommand = (command, configuration) => {
  if (command === 'run') {
    validate(configuration, configurationSchemaRun);
    _transformRelativePathToAbsolute(configuration);
  } else if (command === 'use') {
    validate(configuration, configurationSchemaUse);
  } else {
    throw new Error(`Invalid command used: ${command}`);
  }
};

const _transformRelativePathToAbsolute = config => {
  config.passwordFile = path.isAbsolute(config.passwordFile) ? config.passwordFile : path.resolve(UUCOMMANDER_HOME, config.passwordFile);
  config.data = path.isAbsolute(config.data) ? config.data : path.resolve(UUCOMMANDER_HOME, config.data);
};

module.exports = {
  loadConfig
};

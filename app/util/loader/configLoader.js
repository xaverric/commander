const fs = require('fs');
const os = require('os');
const path = require('path');
const validate = require('../../validation/validator');
const configurationSchemaUse = require('../../validation/configuration/schema-use');
const configurationSchemaRun = require('../../validation/configuration/schema-run');

const CONFIG_BASE_FOLDER_NAME = '.uucommander';
const CONFIG_FILE_NAME = 'cfg.json';
const PATH_SEPARATOR = path.sep;
const HOME = os.homedir();
const CONFIG_DEFAULT_PATH = `${HOME}${PATH_SEPARATOR}${CONFIG_BASE_FOLDER_NAME}${PATH_SEPARATOR}${CONFIG_FILE_NAME}`;

const ALLOWED_CONFIG_ARGUMENTS = Object.keys(configurationSchemaUse);

const loadConfig = (cmdArgs = {}) => {
  const config = _loadConfigFile(cmdArgs);
  const mergedConfig = _mergeConfigurationWithCmdArguments(cmdArgs, config);
  cmdArgs.command === 'run' ? validate(mergedConfig, configurationSchemaRun) : validate(mergedConfig, configurationSchemaUse);
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
    console.log(`Unexpected error occurred during configuration loading. Stacktrace: ${err}`);
    process.exit();
  }
  return data;
};

const _loadConfigFromCustomPath = (path) => {
  let data;
  if (fs.existsSync(path)) {
    console.log(`Loading configuration from custom path: ${path}`);
    data = JSON.parse(fs.readFileSync(path));
  } else if (path) {
    console.log(`Custom path is not valid. The file does not exists. Path: ${path}`);
  }
  return data;
};

const _loadConfigFromDefaultPath = () => {
  let data;
  if (fs.existsSync(CONFIG_DEFAULT_PATH)) {
    console.log(`Loading configuration from default path: ${CONFIG_DEFAULT_PATH}`);
    data = JSON.parse(fs.readFileSync(CONFIG_DEFAULT_PATH));
  } else {
    console.log(`Configuration on default path ${CONFIG_DEFAULT_PATH} does not exist.`);
  }
  return data;
};

const _loadConfigFromCmdArguments = (cmdArguments) => {
  console.log('No configuration found, using command line arguments only.');
  return cmdArguments;
};

const _mergeConfigurationWithCmdArguments = (cmdArgs, config = {}) => {
  let mergedConfig;
  if (_isEnvRequested(cmdArgs)) {
    if (_isEnvInConfig(cmdArgs, config) && _isNotEmpty(cmdArgs?.environment)) {
      mergedConfig = { ...config?.environment[cmdArgs?.environment] };
    } else {
      console.log(`Requested environment does not exist in the configuration: '${cmdArgs?.environment}'`);
      process.exit();
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

module.exports = {
  loadConfig
};

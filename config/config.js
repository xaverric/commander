const os = require('os');
const path = require('path');

const CONFIG_BASE_FOLDER_NAME = '.uucommander';
const CONFIG_FILE_NAME = 'cfg.json';
const PATH_SEPARATOR = path.sep;
const HOME = os.homedir();

const UUCOMMANDER_HOME = `${HOME}${PATH_SEPARATOR}${CONFIG_BASE_FOLDER_NAME}`;
const CONFIG_DEFAULT_PATH = `${UUCOMMANDER_HOME}${PATH_SEPARATOR}${CONFIG_FILE_NAME}`;

module.exports = {
  UUCOMMANDER_HOME,
  CONFIG_DEFAULT_PATH,
  PATH_SEPARATOR
};

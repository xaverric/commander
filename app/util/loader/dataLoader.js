const fs = require('fs');
const validate = require('../../validation/validator');
const dataSchema = require('../../validation/data/schema');

const logger = require('../../../config/logger');

const loadDataFile = (path) => {
  let data = {};
  try {
    if (fs.existsSync(path)) {
      logger.debug(`Loading data from path: ${path}`);
      data = JSON.parse(fs.readFileSync(path));
    } else {
      logger.error(`No data file found on the given path: ${path}`);
    }
  } catch (err) {
    logger.error(`Unexpected error occurred during input data loading. Error: ${err}`);
  }
  return data;
};

const loadData = (path) => {
  const data = loadDataFile(path);
  validate(data, dataSchema);
  return data;
};

module.exports = {
  loadData
};

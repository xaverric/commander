const fs = require('fs');
const validate = require('../../validation/validator');
const dataSchema = require('../../validation/data/schema');

const loadDataFile = (path) => {
  let data;
  try {
    if (fs.existsSync(path)) {
      console.log(`Loading data from path: ${path}`);
      data = JSON.parse(fs.readFileSync(path));
    } else {
      console.log(`No data file found on the given path: ${path}`);
    }
  } catch (err) {
    console.log(`Unexpected error occurred during input data loading. Error: ${err}`);
  }
  if (!data) {
    process.exit();
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

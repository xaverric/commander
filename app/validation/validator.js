const logger = require('../../config/logger');

/**
 * Performs validation of given data against provided schema definition.
 *
 * Prints errors and warnings into the console if available.
 * If error is returned, the process is terminated with printing the current data which did not pass the validation.
 *
 * @param data
 * @param schema
 * @returns {boolean}
 */
const validate = (data, schema) => {
  const [errors, warnings] = getValidationResult(data, schema);
  errors.forEach((err) => logger.error(err));
  warnings.forEach((warn) => logger.warn(warn));
  if (errors.length > 0) {
    throw new Error('Terminating further processing.');
  }
};

/**
 * Performs validation of given data against provided schema definition.
 *
 * @param data
 * @param schema
 * @return {[Array<String>, Array<String>]}
 */
const getValidationResult = (data, schema) => {
  const errors = _getErrors(data, schema);
  const warnings = _getWarnings(data, schema);

  return [errors, warnings];
};

const _getErrors = (data, schema) => _getKeys(schema)
  .filter((key) => filterErrors(data, schema, key))
  .map((key) => `Item ${key} is empty or invalid. Value: ${data[key]}.`);

const filterErrors = (data, schema, key) => {
  if (data?.environment) {
    Object.keys(data.environment).forEach(envName => !schema[key](data.environment[envName]));
  } else {
    return !schema[key](data[key]);
  }
};

const _getWarnings = (data, schema) => {
  const dataKeys = _getKeys(data);
  const schemaKeys = _getKeys(schema);

  return dataKeys
    .filter((key) => !schemaKeys.includes(key))
    .map((key) => `Item ${key} is not defined in validation schema. Item will be ignored.`);
};

const _getKeys = (data) => {
  let dataKeys;
  if (data.environment) {
    dataKeys = Object.keys(data.environment)
      .flatMap((envName) => Object.keys(data.environment[envName]));
  } else {
    dataKeys = Object.keys(data);
  }
  return dataKeys;
};

module.exports = validate;

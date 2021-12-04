const isUri = require('isuri');

const configurationSchema = {
  passwordFile: (value) => value && value.length !== 0,
  uri: (value) => value && value.length !== 0 && isUri.isValid(value),
  data: (value) => value && value.length !== 0,
  method: (value) => value && ['GET', 'POST', 'PUT', 'DELETE'].includes(value),
  // optional parameter - return true if value does not exist in the schema
  proxy: (value) => {
    if (value) {
      return value.length !== 0;
    }
    return true;
  }
};

module.exports = configurationSchema;

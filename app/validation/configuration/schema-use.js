const isUri = require('isuri');

const configurationSchema = {
  passwordFile: (value) => value && value.length !== 0,
  // optional parameter - return true if value does not exist in the schema
  uri: (value) => {
    if (value) {
      return value.length !== 0 && isUri.isValid(value);
    }
    return true;
  },
  // optional parameter - return true if value does not exist in the schema
  data: (value) => {
    if (value) {
      return value.length !== 0;
    }
    return true;
  },
  // optional parameter - return true if value does not exist in the schema
  method: (value) => {
    if (value) {
      return ['GET', 'POST', 'PUT', 'DELETE'].includes(value);
    }
    return true;
  },
  // optional parameter - return true if value does not exist in the schema
  proxy: (value) => {
    if (value) {
      return value.length !== 0;
    }
    return true;
  }
};

module.exports = configurationSchema;

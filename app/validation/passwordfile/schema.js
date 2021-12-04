const isUri = require('isuri');

const dataSchema = {
  accessCode1: (value) => value && value.length !== 0,
  accessCode2: (value) => value && value.length !== 0,
  oidcHost: (value) => value && value.length !== 0 && isUri.isValid(value)
};

module.exports = dataSchema;

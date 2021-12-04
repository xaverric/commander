const propertiesReader = require('properties-reader');
const validate = require('../../validation/validator');
const dataSchema = require('../../validation/passwordfile/schema');

const ACCESS_CODE_1 = 'credentials.accessCode1';
const ACCESS_CODE_2 = 'credentials.accessCode2';
const OIDC_HOST = 'oidc.oidcHost';

const loadPasswordFile = (path) => {
  console.log(`Loading credentials information from path: ${path}`);
  const pwdProperties = propertiesReader(path);
  const pwdConfig = _transformPropsIntoObject(pwdProperties);
  validate(pwdConfig, dataSchema);
  return pwdConfig;
};

const _transformPropsIntoObject = (props) => ({
  accessCode1: props.get(ACCESS_CODE_1),
  accessCode2: props.get(ACCESS_CODE_2),
  oidcHost: props.get(OIDC_HOST)
});

module.exports = {
  loadPasswordFile
};

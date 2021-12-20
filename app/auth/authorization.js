const { callCommand } = require('../client/calls');
const { loadPasswordFile } = require('../util/loader/passwordFileLoader');

const login = async (config) => {
  const pwdFile = loadPasswordFile(config.passwordFile);
  const credentials = {
    accessCode1: pwdFile.accessCode1,
    accessCode2: pwdFile.accessCode2,
    grant_type: 'password',
    scope: 'openid https:// http://localhost'
  };

  const [response] = await callCommand({ ...config, uri: pwdFile.oidcHost }, credentials);
  return response.id_token;
};

module.exports = login;

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const HttpsProxyAgent = require('https-proxy-agent');
const logger = require('./../../config/logger');

/**
 * Calls any command with given dtoIn.
 *
 * @param config contains information about uri, HTTP method or proxy configuration
 * @param data request body
 * @param token authorization token, if empty, dtoIn is prepared in a way for oidc/grantToken
 * @returns {Promise<(*|*)[]>}
 */
const callCommand = async (config, data, token = null) => {
  const dtoIn = prepareDtoIn(config, data, token);
  token && logger.debug(`Calling command ${dtoIn.method}: ${config.uri} with dtoIn:\n${stringifyDtoIn(dtoIn)}`);
  const response = await fetch(config.uri, dtoIn);
  return [await response.json(), response.status];
};

const prepareDtoIn = (config, data, token) => {
  const dtoIn = {
    method: token ? config.method : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: shouldFillBody(config, token) ? JSON.stringify(data) : null
  };
  if (token) {
    dtoIn.headers.Authorization = `Bearer ${token}`;
  }
  if (config.proxy) {
    dtoIn.agent = new HttpsProxyAgent(config.proxy);
  }
  return dtoIn;
};

const shouldFillBody = (config, token) => {
  return config.method === 'POST' || !token;
};

/**
 * Transforms dtoIn into the string value and removes any confidential information from it.
 *
 * @param dtoIn
 */
const stringifyDtoIn = (dtoIn) => JSON.stringify({ ...dtoIn, headers: { ...dtoIn.headers, Authorization: '***' }, agent: null }, null, 4);

module.exports = {
  callCommand
};

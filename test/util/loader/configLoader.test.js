const path = require('path');
const { loadConfig } = require('../../../app/util/loader/configLoader');

const PATH_SEPARATOR = path.sep;
const VALID_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}valid-custom-config.json`;
const INVALID_EMPTY_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}invalid-empty-custom-config.json`;
const INVALID_STRUCTURE_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}invalid-structure-custom-config.json`;
const INVALID_MISSING_PARAMETERS_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}invalid-missing-parameters-custom-config.json`;
const INVALID_UNWANTED_PARAMETERS_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}invalid-unwanted-parameters-custom-config.json`;

let mockExit;
let consoleSpy;

beforeEach(() => {
  mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  consoleSpy = jest.spyOn(console, 'log');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Load configuration from custom path', () => {
  test('Load valid configuration', () => {
    const config = loadConfig({ config: VALID_CUSTOM_CONFIG_PATH });

    expect(config).toBeDefined();
    expect(config).toHaveProperty('environment');

    expect(config.environment).toHaveProperty('env1');
    expect(config.environment.env1).toHaveProperty('passwordFile');
    expect(config.environment.env1).toHaveProperty('data');
    expect(config.environment.env1).toHaveProperty('method');

    expect(config.environment.env1.passwordFile).toBe('passwordFile1.properties');
    expect(config.environment.env1.data).toBe('C:\\Users\\user\\Desktop\\data.json');
    expect(config.environment.env1.method).toBe('GET');

    expect(config.environment).toHaveProperty('env2');
    expect(config.environment.env2).toHaveProperty('passwordFile');
    expect(config.environment.env2).toHaveProperty('data');
    expect(config.environment.env2).toHaveProperty('method');
    expect(config.environment.env2).toHaveProperty('uri');

    expect(config.environment.env2.passwordFile).toBe('passwordFile2.properties');
    expect(config.environment.env2.data).toBe('C:\\Users\\user2\\Desktop\\data.json');
    expect(config.environment.env2.method).toBe('POST');
    expect(config.environment.env2.uri).toBe('http://1.2.3.4/uri/test');
  });
  test('Load valid configuration with additional valid cmd arguments', () => {
    const config = loadConfig({
      config: VALID_CUSTOM_CONFIG_PATH, environment: 'env1', uri: 'http://1.2.3.4/uri/with/cmg/args', passwordFile: 'myPwdFile'
    });

    expect(config).toBeDefined();
    expect(config).toHaveProperty('passwordFile');
    expect(config).toHaveProperty('data');
    expect(config).toHaveProperty('method');
    expect(config).toHaveProperty('uri');

    expect(config.passwordFile).toBe('myPwdFile');
    expect(config.data).toBe('C:\\Users\\user\\Desktop\\data.json');
    expect(config.method).toBe('GET');
    expect(config.uri).toBe('http://1.2.3.4/uri/with/cmg/args');
  });
  test('Load valid configuration with additional invalid cmd arguments', () => {
    const config = loadConfig({ config: VALID_CUSTOM_CONFIG_PATH, environment: 'env1', unknownParameter: true });

    expect(config).toBeDefined();
    expect(config).toHaveProperty('passwordFile');
    expect(config).toHaveProperty('data');
    expect(config).toHaveProperty('method');

    expect(config.passwordFile).toBe('passwordFile1.properties');
    expect(config.data).toBe('C:\\Users\\user\\Desktop\\data.json');
    expect(config.method).toBe('GET');
  });
  test('Load empty configuration', () => {
    loadConfig({ config: INVALID_EMPTY_CUSTOM_CONFIG_PATH });

    expect(mockExit).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Loading configuration from custom path: ${INVALID_EMPTY_CUSTOM_CONFIG_PATH}`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, '[ERROR]: item "passwordFile" is empty or invalid. Value: "undefined".');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, '{}');
  });
  test('Load invalid configuration - invalid structure', () => {
    loadConfig({ config: INVALID_STRUCTURE_CUSTOM_CONFIG_PATH });

    expect(mockExit).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Loading configuration from custom path: ${INVALID_STRUCTURE_CUSTOM_CONFIG_PATH}`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, '[ERROR]: item "passwordFile" is empty or invalid. Value: "undefined".');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, '[WARNING]: item "env" is not defined in validation schema. Item will be ignored.');
  });
  test('Load invalid configuration - missing arguments', () => {
    loadConfig({ config: INVALID_MISSING_PARAMETERS_CUSTOM_CONFIG_PATH, environment: 'env1' });

    expect(mockExit).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Loading configuration from custom path: ${INVALID_MISSING_PARAMETERS_CUSTOM_CONFIG_PATH}`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, '[ERROR]: item "passwordFile" is empty or invalid. Value: "undefined".');
  });
  test('Load invalid configuration - unwanted arguments', () => {
    loadConfig({ config: INVALID_UNWANTED_PARAMETERS_CUSTOM_CONFIG_PATH, environment: 'env1' });

    expect(mockExit).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Loading configuration from custom path: ${INVALID_UNWANTED_PARAMETERS_CUSTOM_CONFIG_PATH}`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, '[ERROR]: item "passwordFile" is empty or invalid. Value: "undefined".');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, '[WARNING]: item "unwanted" is not defined in validation schema. Item will be ignored.');
  });
  test('Load empty configuration with run command', () => {
    loadConfig({ config: INVALID_EMPTY_CUSTOM_CONFIG_PATH, command: 'run' });

    expect(mockExit).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenNthCalledWith(1, `Loading configuration from custom path: ${INVALID_EMPTY_CUSTOM_CONFIG_PATH}`);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, '[ERROR]: item "passwordFile" is empty or invalid. Value: "undefined".');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, '[ERROR]: item "uri" is empty or invalid. Value: "undefined".');
    expect(consoleSpy).toHaveBeenNthCalledWith(4, '[ERROR]: item "data" is empty or invalid. Value: "undefined".');
    expect(consoleSpy).toHaveBeenNthCalledWith(5, '[ERROR]: item "method" is empty or invalid. Value: "undefined".');
    expect(consoleSpy).toHaveBeenNthCalledWith(6, '{}');
  });
});

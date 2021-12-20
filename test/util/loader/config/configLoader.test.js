const path = require('path');
const { loadConfig } = require('../../../../app/util/loader/configLoader');

const logger = require('../../../../config/logger');

const PATH_SEPARATOR = path.sep;
const VALID_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}valid-custom-config.json`;
const INVALID_EMPTY_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}invalid-empty-custom-config.json`;
const INVALID_STRUCTURE_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}invalid-structure-custom-config.json`;
const INVALID_MISSING_PARAMETERS_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}invalid-missing-parameters-custom-config.json`;
const INVALID_UNWANTED_PARAMETERS_CUSTOM_CONFIG_PATH = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}invalid-unwanted-parameters-custom-config.json`;

const BASE_CMD_ARGS = { command: 'use' };

let loggerErrorSpy;
let loggerWarnSpy;
let loggerDebugSpy;

beforeEach(() => {
  loggerErrorSpy = jest.spyOn(logger, 'error');
  loggerWarnSpy = jest.spyOn(logger, 'warn');
  loggerDebugSpy = jest.spyOn(logger, 'debug');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Load configuration from custom path', () => {
  test('Load valid configuration', () => {
    const config = loadConfig({ ...BASE_CMD_ARGS, config: VALID_CUSTOM_CONFIG_PATH });

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
      ...BASE_CMD_ARGS,
      config: VALID_CUSTOM_CONFIG_PATH,
      environment: 'env1',
      uri: 'http://1.2.3.4/uri/with/cmg/args',
      passwordFile: 'myPwdFile'
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
    const config = loadConfig({ ...BASE_CMD_ARGS, config: VALID_CUSTOM_CONFIG_PATH, environment: 'env1', unknownParameter: true });

    expect(config).toBeDefined();
    expect(config).toHaveProperty('passwordFile');
    expect(config).toHaveProperty('data');
    expect(config).toHaveProperty('method');

    expect(config.passwordFile).toBe('passwordFile1.properties');
    expect(config.data).toBe('C:\\Users\\user\\Desktop\\data.json');
    expect(config.method).toBe('GET');
  });
  test('Load empty configuration', () => {
    const cmdArguments = { ...BASE_CMD_ARGS, config: INVALID_EMPTY_CUSTOM_CONFIG_PATH };

    expect(() => loadConfig(cmdArguments)).toThrow(new Error('Terminating further processing.'));

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'Item passwordFile is empty or invalid. Value: undefined.');
  });
  test('Load invalid configuration - invalid structure', () => {
    const cmdArguments = { ...BASE_CMD_ARGS, config: INVALID_STRUCTURE_CUSTOM_CONFIG_PATH };

    expect(() => loadConfig(cmdArguments)).toThrow(new Error('Terminating further processing.'));

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'Item passwordFile is empty or invalid. Value: undefined.');
    expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, 'Item env is not defined in validation schema. Item will be ignored.');
  });
  test('Load invalid configuration - missing arguments', () => {
    const cmdArguments = { ...BASE_CMD_ARGS, config: INVALID_MISSING_PARAMETERS_CUSTOM_CONFIG_PATH, environment: 'env1', debug: true };

    expect(() => loadConfig(cmdArguments)).toThrow(new Error('Terminating further processing.'));

    expect(loggerDebugSpy).toHaveBeenNthCalledWith(1, `Loading configuration from custom path: ${INVALID_MISSING_PARAMETERS_CUSTOM_CONFIG_PATH}`);
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'Item passwordFile is empty or invalid. Value: undefined.');
  });
  test('Load invalid configuration - unwanted arguments (with debug option)', () => {
    const cmdArguments = { ...BASE_CMD_ARGS, config: INVALID_UNWANTED_PARAMETERS_CUSTOM_CONFIG_PATH, environment: 'env1', debug: true };

    expect(() => loadConfig(cmdArguments)).toThrow(new Error('Terminating further processing.'));

    expect(loggerDebugSpy).toHaveBeenNthCalledWith(1, `Loading configuration from custom path: ${INVALID_UNWANTED_PARAMETERS_CUSTOM_CONFIG_PATH}`);
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'Item passwordFile is empty or invalid. Value: undefined.');
    expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, 'Item unwanted is not defined in validation schema. Item will be ignored.');
  });
  test('Load empty configuration with run command', () => {
    const cmdArguments = { command: 'run', config: INVALID_EMPTY_CUSTOM_CONFIG_PATH };

    expect(() => loadConfig(cmdArguments)).toThrow(new Error('Terminating further processing.'));

    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'Item passwordFile is empty or invalid. Value: undefined.');
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(2, 'Item uri is empty or invalid. Value: undefined.');
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(3, 'Item data is empty or invalid. Value: undefined.');
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(4, 'Item method is empty or invalid. Value: undefined.');
  });
});

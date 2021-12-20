const path = require('path');
const { loadPasswordFile } = require('../../../../app/util/loader/passwordFileLoader');

const logger = require('../../../../config/logger');

const PATH_SEPARATOR = path.sep;
const VALID_PWD_PATH = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}valid-password-file.properties`;
const INVALID_PWD_PATH = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}invalid-password-file.properties`;
const INVALID_PWD_PATH2 = `${__dirname}${PATH_SEPARATOR}test-data${PATH_SEPARATOR}invalid-password-file2.properties`;

let loggerErrorSpy;

beforeEach(() => {
  loggerErrorSpy = jest.spyOn(logger, 'error');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Load password file', () => {
  test('Load valid password file', () => {
    const pwdFile = loadPasswordFile(VALID_PWD_PATH);

    expect(pwdFile).toBeDefined();
    expect(pwdFile.accessCode1).toBe('ac1');
    expect(pwdFile.accessCode2).toBe('ac2');
    expect(pwdFile.oidcHost).toBe('https://www.oidchost.com');
  });
  test('Load invalid password file - missing credentials section', () => {
    expect(() => loadPasswordFile(INVALID_PWD_PATH)).toThrow(new Error('Terminating further processing.'));
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'Item accessCode1 is empty or invalid. Value: null.');
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(2, 'Item accessCode2 is empty or invalid. Value: null.');
  });
  test('Load invalid password file - missing oidcHost section', () => {
    expect(() => loadPasswordFile(INVALID_PWD_PATH2)).toThrow(new Error('Terminating further processing.'));
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, 'Item oidcHost is empty or invalid. Value: null.');
  });
});

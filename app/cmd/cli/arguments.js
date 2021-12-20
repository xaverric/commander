const commandLineArgs = require('command-line-args');

const cmdArgumentsDefinition = [
  {
    name: 'command',
    defaultOption: true,
    type: String,
    description: 'use, run, help commands. All these can be used as default commands without providing --command argument\n'
  },
  {
    name: 'environment',
    alias: 'e',
    type: String,
    description: 'Environment configuration parameters, loaded from the configuration file.\n'
  },
  {
    name: 'uri',
    alias: 'u',
    type: String,
    description: 'URI which will be repeatedly called with the data from dtoIn.\n'
  },
  {
    name: 'method',
    alias: 'm',
    type: String,
    description: 'HTTP request method to be used with command call. It is needed to be defined in upper case. Supported methods: GET, POST, PUT, DELETE\n'
  },
  {
    name: 'data',
    alias: 'd',
    type: String,
    description: `Path specifying location data file with list of dtoIn. Path can be absolute or relative. In case relative path is defined, it is relative to the base folder $HOME/.uucommander. The file needs to be written according to the following convention. Each dtoIn inside the itemList array must meet the criteria of the dtoIn for the uri to be called. 
    
    Data File Convention
    \\{\\'itemList\\': [\\{dtoIn1\\}, \\{dtoIn2\\}]\\}
    `
  },
  {
    name: 'output',
    alias: 'o',
    type: String,
    description: `Path specifying location for the output generated during the run command.
    
    Each command call is represented with the *.dtoIn.json and *.dtoOut.json
    `
  },
  {
    name: 'config',
    alias: 'c',
    type: String,
    description: `Custom configuration file path. By default, the configuration is being read from $HOME/.commander/config/cfg.json). In case the custom file path is not provided, and default configuration also does not exists, the tool will use only the arguments provided from command line.
    
    Parameters Priority
    The cmd arguments have the higher priority => In case one parameter exist in both - default/custom configuration file and cmd argument, the value from cmd argument is used.
    
    Configuration File Convention
    \\{\\'environment\\': \\{\\'envName\\': \\{ \\'passwordFile\\': \\'password file path\\'\\, \\'uri\\': \\'command uri\\'\\, \\'data\\': \\'data file path\\'\\} \\} \\}
    `
  },
  {
    name: 'passwordFile',
    alias: 'p',
    type: String,
    description: `Username credentials in the form of properties file. The password file also has to contain uri of the grantToken command on OIDC under the property name oidcHost.
    
    Password File Convention 
    [credentials]
    accessCode1 = ...
    accessCode2 = ...
    
    [oidc]
    oidcHost = ... 
   `
  },
  {
    name: 'proxy',
    type: String,
    description: 'Proxy configuration uri to allow communication sending request via proxy.\n'
  },
  {
    name: 'debug',
    type: Boolean,
    description: 'Flag defining whether debug information should be logged into the console.\n'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Displays this usage guide.'
  }
];

const cmdArguments = commandLineArgs(cmdArgumentsDefinition, { stopAtFirstUnknown: true });

module.exports = {
  cmdArgumentsDefinition,
  cmdArguments
};

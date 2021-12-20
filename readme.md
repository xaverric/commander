# uuCommander CLI

An amazing command line tool allowing you to call commands with a list of dtoIn on the commands which does not accept the dtoIn list.

[![CircleCI](https://circleci.com/gh/xaverric/commander/tree/master.svg?style=shield)](https://circleci.com/gh/xaverric/commander/tree/master)

## Installation
```
npm install -g uucommander
```

## Usage
```
uucommander <command> <command parameters>
```

## Commands
```
help    Displays the detail user guide into the console
use     Displays current configuration to the user.
run     Does the whole magic. Based on the loaded configuration it performs command calls in a chain.
```

## Parameters
### **--command** [string] 
use, run, help commands. All these can be used as default commands without providing --command argument

### -e, --environment [string]
Environment configuration parameters, loaded from the configuration file.

### -u, --uri [string]
URI which will be repeatedly called with the data from dtoIn.

### -m, --method [string]
HTTP request method to be used with command call. It is needed to be defined in upper case. Supported methods: GET, POST, PUT, DELETE

###  -d, --data [string]
Path specifying location data file with list of dtoIn. Path can be absolute or relative. In case relative path is defined, it is relative to the base folder ```$HOME/.uucommander```. The file needs to be written according to the following convention. Each dtoIn inside the itemList array must meet the criteria of the dtoIn for the uri to be called.

**Data File Convention**
```json
{
  "itemList": [
    {}, 
    {}
  ]
}
```
### -o --output [string]
Path specifying location for the output generated during the run command. Each command call is represented with the *.dtoIn.json and *.dtoOut.json

### -c, --config [string]
Custom configuration file path. By default, the configuration is being read from $HOME/.commander/config/cfg.json). In case the custom file path is not provided, and default configuration also does not exists, the tool will use only the arguments provided from command line.

**Parameters Priority**

The cmd arguments have the higher priority => In case one parameter exist in both - default/custom configuration file and cmd argument, the value from cmd argument is used.

**Configuration File Convention**
```json
{
  "environment": {
    "envName": { 
      "passwordFile": "password file path", 
      "uri": "command uri", 
      "data": "data file path"
    }
  }
}
```

### -p, --passwordFile [string]
Username credentials in the form of properties file. The password file also
has to contain uri of the grantToken command on OIDC under the property name
oidcHost.

**Password File Convention**
```properties
[credentials]
accessCode1 = ...
accessCode2 = ...

[oidc]
oidcHost = ...
```

### --proxy [string]
Proxy configuration uri to allow communication sending request via proxy.

### --debug
Flag defining whether debug information should be logged into the console.

### -h, --help                  
Display the usage guide

## Change Log
### 2.1.0 - 20.12.2021
* any file path in the configuration can now be both - absolute or relative
  * if relative path is used, it is always relative to the ```$HOME/.uucommander``` path.
* improved logging - integration of [winston](https://github.com/winstonjs/winston) logger library.
  * all logs with various levels can be found in the ```$HOME/.uucommander/logs``` folder.
  * by default, **info** level is being used for logging into the console
* new configuration parameter ```--debug``` which allows writing debug information into the console
* new configuration parameter ```-o, --output``` which saves the results of command calls into the predefined directory 
  * directory is created if it does not exist
  * each command call is represented with the ```*.dtoIn.json``` and ```*.dtoOut.json```

### 2.0.1 - 06.12.2021
* add git link into the ```package.json```
* minor modifications to remove unwanted logging into the console
### 2.0.0 - 05.12.2021
* commander renames to uuCommander and becomes a CLI tool
* configuration support - configuration can now be loaded from:
  * default path (```$HOME/.uucommander/cfg.json```)
  * custom path (any path to the cfg.json file defined via ```--config``` cmd argument)
  * cmd arguments
* authentication with ```passwordFile``` 
* proxy support
### 1.0.0 - 22.09.2021
* Call multiple commands with running index.js script and passing it the parameters in correct order
  * node index.js "username" "password" "http://1.2.3.4:5678" "uu-oidc-maing02" 11111111111111111111111111111111 "user/list" "C:\... \dtoInData.json" "POST"
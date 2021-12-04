# uuCommander CLI

An amazing command line tool allowing you to call commands with a list of dtoIn on the commands which does not accept the dtoIn list.

### Installation
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
Path specifying location data file with list of dtoIn. The file needs to be written according to the following convention. Each dtoIn inside the itemList array must meet the criteria of the dtoIn for the uri to be called.

**Data File Convention**
```json
{
  "itemList": [
    {}, 
    {}
  ]
}
```
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

### -h, --help                  
Display the usage guide

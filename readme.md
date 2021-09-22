# Commander

Call REST API on uuApplications.

### Installation

```
npm install
```

### Usage 

```
node index.js "username" "password" "http://1.2.3.4:5678" "uu-oidc-maing02" 11111111111111111111111111111111 "user/list" "C:\... \dtoInData.json" "POST"
```
### Parameters

Parameters need to be defined in the following order.

* *username*
    * accessCode1 to login against OIDC
* *password* 
    *  accessCode2 to login against OIDC
* *host* 
    * host IP address/domain name
* *application* 
    * application name, e.g. *uu-oidc-maing02*
* *awid* 
    * application workspace ID
* *useCase* 
    * use case to be called, e.g. *user/list*
* *dtoInPath*
    * path to the file with dtoIn list
* *method*
    * HTTP method, e.g. *POST*, *GET*,...

### DtoIn Data 

Data in the file located under *dtoInPath* need to be written according the following convention. Each *dtoIn* inside the *itemList* must meet the criteria of the *dtoIn* for the command/use case to be called.
```json
{
  "itemList": [
    { dtoIn1 },
    { dtoIn2 },
    ...
  ]
}
```

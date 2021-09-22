import fs from "fs";
import fetch from "node-fetch";

const args = process.argv.slice(2);

// arguments definition
const username = args[0];
const password = args[1];
const host = args[2];
const application = args[3];
const awid = args[4]
const useCase = args[5];
const dtoInPath = args[6];
const method = args[7];

const login = async(username, password, host) => {
    const credentials = {
        "accessCode1": username,
        "accessCode2": password,
        "grant_type": "password"
    };
    const response = await fetch(`${host}/uu-oidc-maing02/11111111111111111111111111111111/oidc/grantToken`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    return await response.json()
};

const callCommand = async (uri, token, method, dtoIn) => {
    const commandDtoIn = prepareDtoIn(dtoIn, token, method);
    console.log(`Calling command ${method}: ${uri} with dtoIn: ${JSON.stringify(commandDtoIn, null, 4)}`);

    const response = await fetch(uri, commandDtoIn);

    return await response.json();
}

const prepareDtoIn = (data, token, method) => {
    return {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };
}

const loadDtoInData = dtoInPath => {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(dtoInPath));
    } catch (err) {
        data = null;
    }
    return data;
}

const main = async () => {
    console.log("START");

    const uri = `${host}/${application}/${awid}/${useCase}`;

    const dtoInData = loadDtoInData(dtoInPath);
    const token = await login(username, password, host);

    for (const dtoIn of dtoInData.itemList) {
        const result = await callCommand(uri, token["id_token"], method, dtoIn);
        console.log(`Response: ${JSON.stringify(result, null, 4)}`);
    }

    console.log("END");
};

await main();


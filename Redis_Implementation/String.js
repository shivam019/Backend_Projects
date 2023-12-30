const client = require("./client")

async function init(){
    const result = await client.get("name")
    console.log("Result --->", result);
}

init();
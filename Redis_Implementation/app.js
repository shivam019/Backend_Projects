const express = require("express")
const client = require("./client");  //redis client
const { default: axios } = require("axios");
const PORT = 8080;
const app = express();

app.get( "/data", async(req,res)=> {

    //Check wheather the data is cached in the memory or not
    const cacheValue = await client.get('todos');

    if(cacheValue) {
        //.parse transforms JSON String back into Javascript Object or values
        return res.json(JSON.parse(cacheValue));
    }
 
  const {data} = await axios.get('https://jsonplaceholder.typicode.com/todos');

//stringify converts the objects or values into JSON String.
  await client.set("todos", JSON.stringify(data))
  await client.expire("todos", 30);
  return res.json(data);
})


app.listen( PORT, ()=> console.log(`Connected to Server at PORT ${PORT}`));
const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const PORT = 8000

//connection
mongoose.connect('mongodb://127.0.0.1:27017/youtube-app-1')
.then(() => console.log("MongoDB Connected"))
.then((err) => console.log("Mongo error", err));

//Schema
const userSchema = new mongoose.Schema({
     firstname : {
        type: String,
        required : true,
     },
     last_name: {
        type: String,
        required: false,
     },
     email: {
        type: String,
        required: true,
        unique: true,
     },
     jobTitle: {
        type: String,
     },
     gender: {
        type: String,
     }

}, {
    timestamps: true,
});

//Model
const User = mongoose.model("user", userSchema);

//Routes

//GET
app.get( "/api/users", async(req, res)=> {
    allUserData = await User.find({});
    return res.json(allUserData);
})

app.get("/users", async(req, res)=> {
  
const allDBusers = await User.find({});


//SSR (SERVER SIDE RENDERING)
const html = `
   <table>
   <tr>
   <th> First Name </th>
   <th> Last Name </th>
   <th> Desgination </th>
  </tr>
  ${allDBusers.map((users) => 
    `
    <tr>
    <td> ${users.firstname}</td>
    <td> ${users.last_name} </td>
    <td> ${users.jobTitle} </td>
    </tr>   </td>
 `).join('')}
 </table>
    
`;

res.send(html)
})



//Dynamic PATH PARAMETERES GET /api/users/:id
app.get("/api/users/:id", async(req,res)=> {
   
     const user = await User.findById(req.params.id);
     if( !user ) res.send(404).json( {msg: "User not found"});
     
    return res.json(user);
})


//Middleware - plugin
app.use(express.urlencoded({extended: false}));


//POST
app.post("/api/users", async(req,res)=> {
    const body = req.body;
     
    if( 
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ) {
        return res.send(400).json( {msg: "All feilds are required"});
    }

   await User.create ({
    firstname : body.first_name,
    last_name : body.last_name,
    gender : body.gender,
    jobTitle : body.job_title,
    email: body.email,
   });

   return res.send(201).json({msg: "user created sucesfully"})

})



//PATCH
app.patch("/api/users/:id", async(req,res)=> {

    try{
    const userId = req.params.id;
    const reqbody = req.body;
    const allowedFields = [ "first_name", "email"];
    const update = {};

    //check if any disallowed fields are being updated
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedFields.includes(update));
   
    if(!isValidOperation) return res.send(404).json("Not Allowed")

   //Filter the update object tp include only allowed fileds

   for (const fields of allowedFields) {
    if(req.body[fields]) {
      update[fields] = req.body[fields];
    }
   }
 
    const updateUser = await User.findByIdAndUpdate(userId, update, {new : true});

    if(!updateUser) return res.status(404).json({msg: "User not found"})

    return res.status(201).json({status: "Sucess", user : updateUser});
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({error: "Server error"}) 
    }
} )

//Delete

app.delete( "/api/users/:id", async(req,res)=> {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        return res.json( {msg: "user deleted sucessfully", user: deletedUser});
})
app.listen(PORT, ()=> { console.log("connected to the server")})
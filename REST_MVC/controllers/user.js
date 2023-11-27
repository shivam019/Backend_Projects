const User = require("../models/user")

//GET ALL
async function handleGetAllUsers(req,res) {
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
}

//GET User By ID
async function handleGetUserById(req, res) {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({msg: "user not found"});
    return res.json(user);
}

//POST
async function handleAddUser(req, res){
const user = req.body;
if( !user ||
    !user.first_name ||
    !user.last_name ||
    !user.email ||
    !user.gender ||
    !user.job_title
    ) {
        res.status(404).json({msg: "Invalid / Missing Input"})
    }

    await User.create ({
    firstname : user.first_name,
    last_name : user.last_name,
    gender : user.gender,
    jobTitle : user.job_title,
    email: user.email,
    });

    return res.status(201).json({msg:"user added sucessfully", id: User._id})
}


//Delete
async function handleDeletedUser(req, res) {
    const deleteduser = await User.findByIdAndDelete(req.params.id);
    return res.json( {msg: "user deleted sucessfully", user: deleteduser});

}

//Patch

async function handleModifyUser(req, res) {
    const id = req.params.id;
    const reqbody = req.body;
    const allowedFields = ["email"];
    const update = {};
  
    // Check if any disallowed fields are being updated
    const updates = Object.keys(reqbody);
    const isValidOperation = updates.every(field => allowedFields.includes(field));
  
    if (!isValidOperation) return res.status(400).json({ msg: "Not allowed" });
  
    // Filter the update object to include only allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    });
  
    const updateUser = await User.findByIdAndUpdate(id, update, { new: true });
    if (!updateUser) return res.status(404).json({ msg: "Not found" });
  
    return res.status(201).json({ msg: "User updated successfully" });
  };
  

 

module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleAddUser,
    handleDeletedUser,
    handleModifyUser,

}
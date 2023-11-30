const User =require("../models/users");
const {v4: uuidv4} = require("uuid");
const {getUser,setUser} = require("../Service/auth")

async function handleUserSingUp(req, res) {
    const {name, email, password} = req.body;

    console.log(name, email, password);
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    await User.create({
        name,
        email,
        password
    });

    return res.render("home")
}


async function handleUserlogin(req,res) {
    const {email, password}  = req.body;
    const user = await User.findOne({email, password})
    if(!user) return res.status(404).json({msg: "User not found / Incorrect password"})
    
    const token = setUser(user);
    res.cookie('uid', token);
    return res.redirect("/");
}
module.exports = {
    handleUserSingUp,
    handleUserlogin,
}
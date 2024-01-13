const path = require("path")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const PORT = 8000;
const cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie} = require("./middlewares/authentication")

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

mongoose
.connect("mongodb://localhost:27017/blogify")
.then( ()=> console.log("MongoDB Connected"));




const UserRoute = require("./routes/user");
const BlogRoute = require("./routes/blog");
app.use('/user', UserRoute);
app.use('/blog', BlogRoute)

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"))

app.get('/', (req,res)=> {
    res.render('home', {
        user: req.user,
    }); 
} )



app.use('/user', UserRoute);


app.listen(PORT, ()=> console.log("Connected to Server", PORT));
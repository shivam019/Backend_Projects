require("dotenv").config();
const path = require("path")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 8000;
const Blog = require('./models/Blog')
const cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie} = require("./middlewares/authentication")

//Serve data inside public folder statically
app.use(express.static(path.resolve('./public')))

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

mongoose
.connect(process.env.MONGO_URL)
.then( ()=> console.log("MongoDB Connected"));




const UserRoute = require("./routes/user");
const BlogRoute = require("./routes/blog");
app.use('/user', UserRoute);
app.use('/blog', BlogRoute)

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"))

app.get('/', async(req,res)=> {
    const allBlogs = await Blog.find({}).sort("createdAt");

    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    }); 
} )



app.use('/user', UserRoute);


app.listen(PORT, ()=> console.log("Connected to Server", PORT));
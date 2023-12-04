const path = require("path")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const PORT = 8000;

app.use(express.urlencoded({extended: false}));
mongoose
.connect("mongodb://localhost:27017/blogify")
.then( ()=> console.log("MongoDB Connected"));

const UserRoute = require("./routes/user")
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"))

app.get('/', (req,res)=> {
    res.render('home');
} )



app.use('/user', UserRoute);


app.listen(PORT, ()=> console.log("Connected to Server", PORT));
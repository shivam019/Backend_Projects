const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const cookieParser = require('cookie-parser')
const PORT = 8000;
const {restrictToLoggedinUserOnly} = require("./middleware/auth")
const app = express();
app.use(express.json());
app.use(cookieParser());

//Middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//MODEL:>
const URL = require("./models/url")


//Routes:=>

const userRouter = require("./routes/user")
app.use("/user", userRouter);

const staticRouter = require("./routes/static")
app.use("/", staticRouter);

const urlRoutes = require("./routes/url");
app.use("/url", restrictToLoggedinUserOnly, urlRoutes);



//View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


//DB Connection:>
mongoose.connect("mongodb://localhost:27017/short-url").then(()=> {
    console.log("Connected to MongoDB");
})



app.listen( PORT, ()=> console.log("connected to the PORT" , PORT))



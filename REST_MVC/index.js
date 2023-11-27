const express = require("express");
const app = express();
const PORT = 8000;


const userRouter = require("./routes/user");
const {connectMongoDB} = require("./connection")
const {logReqRes} = require("./middlewares")



//Middlewares
app.use(logReqRes("log.txt"));
app.use(express.urlencoded({extended: false}));


//DB CONNECTION
connectMongoDB("mongodb://127.0.0.1:27017/youtube-app-1").then(()=> {
    console.log("MongoDB connected");
})


//User Router
app.use('/user', userRouter);



app.listen(PORT, ()=> { console.log("connected to PORT", PORT)})
require("dotenv").config();
const path = require("path")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const amqp = require("amqplib")
const PORT = process.env.PORT || 9000;
const Blog = require('./models/Blog')
const nodemailer = require('nodemailer')
const cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie} = require("./middlewares/authentication")

//Generate Otp packgae
const GenerateOtp = require('generate-otp');




//Serve data inside public folder statically
app.use(express.static(path.resolve('./public')))

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

mongoose
.connect(process.env.MONGO_URL)
.then( ()=> console.log("MongoDB Connected"));

//RabbitMQ Connection (Running on Docker Port: 15732, AMQP PORTOCAL)
const connectToRabbitMQ = async() => {
try{ 
    //Connection: we make connection to the server running at port 5672
    const connection = await amqp.connect('amqp://localhost:5672');
    //channel: is a logcial concept used to multiplex a single physical TCP connection between client and a node.
    const channel = await connection.createChannel();
    const queue = 'userVerificationQueue';
 
    //assertqueue: check for queue named userVerificationQueue is present or not if not new queue is created with provided name
    await channel.assertQueue(queue, {durable: true});
}
catch(error) {
    console.log(error);
}
  
}


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


connectToRabbitMQ();

app.listen(PORT, ()=> console.log("Connected to Server", PORT));
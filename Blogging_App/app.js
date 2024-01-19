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
const User = require('./models/user')
//Generate Otp packgae
const otpGenerator = require('otp-generator')




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

//RabbitMQ Connection (Running on Docker Port: 15732, AMQP PORTOCAL)
const connectToRabbitMQ = async() => {
try{ 
    //Connection: we make connection to the server running at port 5672
    const connection = await amqp.connect('amqp://localhost:5672');
    //channel: is a logcial concept used to multiplex a single physical TCP connection between client and a node.
    const channel = await connection.createChannel();
    const queue = 'otpQueue';
 
    //assertqueue: check for queue named userVerificationQueue is present or not if not new queue is created with provided name
    await channel.assertQueue(queue, {durable: true});

    //channel.consume: function to setup a message consumer on a specific queue,
    //it accepts two parameter the queue name and function to handle incoming messages.

    channel.consume(queue, async(message)=> {
     const {userId, email} = JSON.parse(message.content.toString());
    await sendVerificationOTP(email, userId);
    channel.ack(message);
    })
  
}
catch(error) {
    console.log(error);
}
  
}


//Nodemailer function (Send Otp)

const sendVerificationOTP = async(to, userId) => {
 try{
     const user = await User.findById(userId);

     if(user) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'digisevakyt@gmail.com',
                pass: process.env.GooglePass
            }
        });

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        console.log(otp);
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 5) //valid for 5 minutes
        console.log(otpExpiry);

        //update user document with otp and otp expiry time
        await User.findByIdAndUpdate(userId, { otp, otpExpiry });

        const mailOptions = {
            from : 'digisevakyt@gmail.com',
            to,
            subject: 'Otp for login',
            text: `your Otp for login is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
     }
 }
 catch (error) {
    console.log('Error in sendVerificationOTP:', error);
 }

}







app.get('/', async(req,res)=> {

    const allBlogs = await Blog.find({}).sort("createdAt");

    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    }); 
} )



app.use('/user', UserRoute);


connectToRabbitMQ().catch(error => console.error('Error connecting to RabbitMQ:', error));

app.listen(PORT, ()=> console.log("Connected to Server", PORT));
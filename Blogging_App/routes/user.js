const {Router} = require("express")
const router = Router();
const User = require('../models/user')
const { createTokenForUser } = require("../service/authentication");
const {publishToQueue} = require("../service/publish")


router.get('/signin', (req,res) => {
    return res.render("signin")
})


router.get('/signup', (req,res) => {
    return res.render("signup")
})

router.post('/signup', async(req,res)=> {
    console.log("user created", req.body);

    const { fullName, email, password} = req.body;
    
    await User.create({
        fullName,
        email,
        password,
    });


    return res.redirect("/")
})


// router.post("/verify-otp", async(req,res) => {
//     const { otp } = req.body

//     console.log(otp);

//     res.redirect("/");
// })


router.post("/signin", async(req,res)=> {
    const{email, password} = req.body;

try {
        const user = await User.matchPasswordAndGenerateToken(email, password);

        if(user) {
          
            //Send verification otp asynchronously using rabbitMQ
            publishToQueue({userId: user._id, email: user.email});
            res.render("otpPage", {
                user: user,
            })
        }


        // const token = createTokenForUser(user);

        // return res.cookie("token", token).redirect("/");
    }

    catch(error){
        return res.render("signin", {
            error: "Incorrect Email or Password", 
        })
    }

})

router.get('/logout', (req,res)=> {
    res.clearCookie("token").redirect("/")
})





module.exports = router ;
const {Router} = require("express")
const router = Router();
const User = require('../models/user')
const { createTokenForUser } = require("../service/authentication");
const {publishToQueue} = require("../service/publish")
const passport = require('passport');
const { route } = require("./user");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');


router.use(passport.initialize());
router.use(passport.session());

//Google OAuth 2.0

passport.use(new GoogleStrategy({
    clientID: process.env.Client_Id,
    clientSecret: process.env.Client_secret,
    callbackURL: process.env.Callback_Url,
 
},
async function(accessToken, refreshToken, profile, done) {
    
        
    try{

        const user = await User.findOne({ googleId: profile.id });
         console.log('test 1', user);

         const { id, displayName} = profile;

            await User.create({
                googleId: id,
                fullName: displayName,
                email: profile.emails[0].value,

            });

    
        console.log('test 2', user);

       return done(null, user);
    }
        catch(error){
            console.error('Error in GoogleStrategy:', error);
            return done(error);
    
        }

  
}));

//serialise user to session
passport.serializeUser( function(user,done){
    done(null,user._id)
})

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser ID:', id);
    User.findById(id, function (err, user) {
        done(err, user);
    });
});




router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/signin' }),
    function (req, res) {
        console.log("callback fn");
        res.render('dashboard', {
            user: req.body,
        });
    }
);




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


router.post("/verify-otp", async(req,res) => {

    try{

       const {otp, userId} = req.body

       console.log(userId);
    
    
       const user = await User.findOne({ _id: userId, otp});
    
       console.log(user);

       if(user && user.otpExpiry && new Date() < new Date(user.otpExpiry)){

        const token = createTokenForUser(user);
    
        return res.cookie("token", token).redirect("/");
       }

       else {
        res.status(401).send('Invalid OTP or expired. Please try again.');

       }
    

    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error')
    }

   
})





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
const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", (req, res) => {
    res.send("Signup");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

     console.log(email, password);
    if (email === "123" && password === "123") {

        session=req.session;
        req.session.userid = email;
        res.render("Dashboard"); 
    } else {
        res.render("login", { error: "Invalid email or password" });
    }
});

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');

    res.redirect('/login');
});


module.exports = router;

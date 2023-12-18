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
    console.log(res.body);
    const { email, password } = req.body;

    if (email === "123" && password === "123") {
        session=req.session;
        req.session.userid = email;
         console.log(req.session)
        res.render("Dashboard"); 
    } else {
        res.render("login", { error: "Invalid email or password" });
    }
});

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;

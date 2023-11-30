const express = require("express")
const router = express.Router();
const URL = require("../models/url")

router.get("/", async(req,res)=> {

    // const AllUrls = await URL.find({});
    // return res.send(AllUrls)
    return res.render("home");
});

router.get("/singup", (req,res)=> {
    return res.render("singup")
});

router.get("/login", (req,res) => {
   return res.render("login")
})
module.exports = router;

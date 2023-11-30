const express = require("express")
const router = express.Router();
const {handleUserSingUp,handleUserlogin} = require("../controllers/user")

router.route('/' )
.post(handleUserSingUp);
 
router.post("/login",handleUserlogin)

module.exports = router;
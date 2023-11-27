const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstname : {
       type: String,
       required : true,
    },
    last_name: {
       type: String,
       required: false,
    },
    email: {
       type: String,
       required: true,
       unique: true,
    },
    jobTitle: {
       type: String,
    },
    gender: {
       type: String,
    }

}, {
   timestamps: true,
});

//Model
const User = mongoose.model("user", userSchema);



module.exports = User;
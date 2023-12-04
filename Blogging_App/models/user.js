const {Schema, model }= require("mongoose")
const { createHmac, randomBytes}  = require("crypto")

const userSchema = new Schema({
 
    fullName: {
        type: String,
        required: true,
    },
    email :{
        type: String,
        required: true,
        unique: true,
    },
   salt: {
    type: String,
   },
   password: {
    type: String,
    required: true,
   },
   profileImageURL: {
    type: String,
    default: '/images/default.png',
   },
   role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
   },

}, {timestamps: true}
)

userSchema.pre('save', function (next) {
    const user = this;
    if(!user.isModified("password")) return;
  
    //salt : random strings (Secret Key for each users)
    const salt = randomBytes(16).toString();
    const hasedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hasedPassword;

    next();
})

  console.log("hello");

const User = model("user", userSchema);

module.exports = User;
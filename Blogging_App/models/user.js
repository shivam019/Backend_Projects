const {Schema, model }= require("mongoose")
const { createHmac, randomBytes}  = require("crypto");
const { createTokenForUser } = require("../service/authentication");

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
    required: false,
    
   },
   profileImageURL: {
    type: String,
    default: '/public/uploads/default.png',
   },
   role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
   },

   otp: {
    type: String,
},
otpExpiry: {
   type: Date,
},
googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values for unique fields, useful if not every user has a Google ID
},

}, {timestamps: true}
)

userSchema.pre('save', function (next) {
    const user = this;
    if(!user.isModified("password")) return;
  
    //salt : random strings (Secret Key for each users)
    const salt = 'Shivam';
    const hasedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hasedPassword;

    next();
})

//Virtual Function to Hash the Entered  User Password and Verify it with the saved hashed password inside the database.
userSchema.static("matchPasswordAndGenerateToken", async function(email,password){
    const user = await this.findOne({email}); 
   if(!user) throw new Error('user Not found');

    const salt = user.salt;
    const hasedpassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  
    if(hasedpassword != userProvidedHash) throw new Error('Incorrect Password');

    // const token = createTokenForUser(user);
    return user;

})

const User = model("user", userSchema);

module.exports = User;
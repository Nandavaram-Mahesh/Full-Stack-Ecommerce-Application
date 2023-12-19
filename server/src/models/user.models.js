import mongoose,{Schema} from 'mongoose';
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { USER_TEMPORARY_TOKEN_EXPIRY, availableSocialLoginTypes, availableUserRoles, userLoginType, userRolesEnum } from '../constants.js';




const UserSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:availableUserRoles,
        default:userRolesEnum.USER,
        required:true
    },
    loginType:{
        type:String,
        enum:availableSocialLoginTypes,
        default:userLoginType.EMAIL_PASSWORD
    },
    avatar: {
        type: {
          url: String,
          localPath: String,
        },
        default: {
          url: 'https://allma.si/blog/wp-content/uploads/2022/11/download-any-file-with-javascript.pnghttps://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png',
          localPath: "",
        },
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String
    },
    emailVerificationExpiry:{
        type:Date
    },
    forgotPasswordToken:{
        type:String
    },
    forgortPasswordExpiry:{
        type:Date
    },
    refreshToken:{
        type:String,
    }
},{ timestamps: true })

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    } 
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

// UserSchema.post("save",async function(user,next){
    
// })

UserSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken=  function(){
    
     return  jwt.sign(
        { 
            _id:this._id,
            userName:this.userName,
            email:this.email,
            role:this.role
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    
        // jwt.sign(payload, secretekey);

}

UserSchema.methods.generateRefreshToken=  function(){
     
    return jwt.sign(
        { 
            _id:this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })

   
       // jwt.sign(payload, secretekey);

}

UserSchema.methods.generateTemporaryToken = function () {
    // This token should be client facing
    // for example: for email verification unHashedToken should go into the user's mail
    const unHashedToken = crypto.randomBytes(20).toString("hex");
  
    // This should stay in the DB to compare at the time of verification
    const hashedToken = crypto
      .createHash("sha256")
      .update(unHashedToken)
      .digest("hex");
    // This is the expiry time for the token (20 minutes)
    const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;
  
    return { unHashedToken, hashedToken, tokenExpiry };
};



const User = mongoose.model('User', UserSchema);

export {User}



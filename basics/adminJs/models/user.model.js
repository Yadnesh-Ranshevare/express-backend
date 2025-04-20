import { mongoose } from "mongoose";
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username:{
        required: true,
        type: String,
        unique: true,
        index: true,
        lowercase: true,
    },
    email:{
        required: true,
        type: String,
        unique: true
    },
    password:{
        required: [ true ],
        type: String,
    },
    refreshToken:{
        type: String
    }
},{timestamps:true})

// userSchema.pre("save",async function(next){     //as encryption may take time we are using async await
//     if(this.isModified("password")){        //this will return the true only if the password felid is change otherwise return false 
//         //we only want to encrypt the password when password felid id changed otherwise don't run this method
//         this.password = await bcrypt.hash(this.password,10)       //encrypting our password
//         next()
//     }else{
//         return next()       //if password felid doesn't change then don't do anything
//     }
// })

// userSchema.methods.isPasswordCorrect = async function(password){ //password send by the user
//     // will compare the password send by the user and password available in database and  return true or false 
//     return await bcrypt.compare(password,this.password)     //this.password is a password store in database will 
// }

// userSchema.methods.generateAccessToken = function(){
//     // console.log("access token called")
//     return jwt.sign({      //will create the access token
//         _id:this._id,       //assign by mongodb
//         email:this.email,
//         username: this.username
//     },
//     process.env.ACCESS_TOKEN_SECRETE,
//     {
//         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
//     }
//     )
// }
// userSchema.methods.generateRefreshToken = function(){
//     // console.log("refresh token called")
//     return jwt.sign(
//         {      //will create the refresh token
//             _id:this._id,       //assign by mongodb
//         },
//         process.env.REFRESH_TOKEN_SECRETE,
//         {
//             expiresIn:process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

const User = mongoose.models.User || mongoose.model("User",userSchema)  

export default User

import mongoose,{ Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,        //cloudinary url
        required:true
    },
    coverImage:{
        type:String,        //cloudinary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[ true || 'password is required' ]
    },
    refreshToken:{
        type:String
    }
},{ timestamps:true })

//pre is a hook use as a middleware which perform certain task just before the saving the data in backend
userSchema.pre("save",async function(next){     //as encryption may take time we are using async await
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)       //encrypting our password
        next()
    }else{
        return next()
    }
})

//we can use our custom method on schema
userSchema.methods.isPasswordCorrect = async function(password){ //password send by the user
    // will compare the password send by the user and password available in database and  return true or false 
    return await bcrypt.compare(password,this.password)     //this.password is a password store in database will 
}


userSchema.methods.generateAccessToken = function(){
    jwt.sign({      //will create the access token
        _id:this._id,       //assign by mongodb
        email:this.email,
        username: this.username,
        fullname: this.fullName  
    },
    process.env.ACCESS_TOKEN_SECRETE,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign({      //will create the refresh token
        _id:this._id,       //assign by mongodb
    },
    process.env.REFRESH_TOKEN_SECRETE,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User",userSchema)
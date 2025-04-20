import { mongoose } from "mongoose";

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


const User = mongoose.models.User || mongoose.model("User",userSchema)  

export default User

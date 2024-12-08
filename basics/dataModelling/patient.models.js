import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    diagonsedWith:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    bloodGroup:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:["male","female","other"],
        required:true
    },
    AddmitedIn:{
        type: mongoose.Schema.Types.ObjectId,       //when ypu want to get reference from another scheme
        ref:"Hospital"      //this should be exactly similar to hospital schema name  
    }
},{timestamp:true})

export const Patient = mongoose.model("Patient", patientSchema)
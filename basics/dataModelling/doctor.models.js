import mongoose from "mongoose"
import { type } from "os"

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experienceInYear:{
        type:Number,
        required:true,
        default:0
    },
    workAt:[        //as one doctor can work for many hospital we will hold this schema into an array which hold multiple hospital where doctor works at
        {       //each object contain single hospital 
            type:mongoose.Schema.Type.ObjectId,     //getting the reference of each hospital from hospital schema
            ref:"Hospital"
        }
    ]
},{timestamp:true})

export const Doctor = mongoose.model("Doctor", doctorSchema)
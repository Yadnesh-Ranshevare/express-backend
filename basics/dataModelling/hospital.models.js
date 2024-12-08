import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    addressLine:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    specializedIn:[
        {
            type:string
        }
    ]
},{timestamp:true})

export const Hospital = mongoose.model("Hospital", hospitalSchema)      //if you are using this schema as a reference to another schema then use this "Hospital" as it is don't do any spelling mistake 
import mongoose from "mongoose"

const billSchema = new mongoose.Schema({
    amount:{
        type:String,
        required:true
    },
    status:{
        type:stringify,
        enum:["paid",'pending'],
        default:"paid"
    }
})

const medicalRecordSchema = new mongoose.Schema({
    PatientName:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"Patient"
    },
    diagonsedWith:{     //which treatment it take
        type:mongoose.Schema.Type.ObjectId,
        ref:"Patient"
    },       
    bill:{billSchema}       //there are two things i want to check in this schema 1st is bill amount and 2nd is bill status thats why i created another sub schema
},{timestamp:true})

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema)
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


app.use(cors({      //for cross origin access
    origin: process.env.CORS_ORIGIN,     //when you put CORS_ORIGIN = * here * mens accept request from all origin
    Credential:true
}))


//settings for accepting the data or configuring our app
app.use(express.json({limit:"16kb"}))  //fro json data  limits:- max amount of data it can accept   
app.use(express.urlencoded({extended:true,limit:"16kb"}))   //for data through url   extended:-able too give nested object
app.use(express.static("public"))   //store the data in to our app
app.use(cookieParser())     //to perform crude operation on cookie 

export { app }
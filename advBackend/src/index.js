// require('dotenv').config({path:'./env'})     //also use this syntax ( only need to use this single line )
import dotenv from 'dotenv'     //this is an experimental feature
import connectDB from "./db/index.js"
import { app } from './app.js'

dotenv.config({path:'./env'})       //declare this if you are using the import syntax for dotenv

connectDB()     //once this function get called database will be connected and will return  promise
.then(() => {
    app.listen(process.env.PORT || 8000,() => {     //once the database is connected start our app
        console.log(`server is running at port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("MONGODB CONNECTION FAILED!!! ",error);
})








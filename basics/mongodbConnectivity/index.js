import mongoose from "mongoose";

mongoose.connect('database_url/database_name')      //it returns a promise  database url must be a environmental variable 
.then(() => console.log("mongodb connected"))
.catch(error => console.log("mongodb connection error: " , error))
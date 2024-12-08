import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//datable is in the another continent therefor it take time to get data from database therefore we use async await
const connectDB = async() => {
    try {       //we might face some error in database connectivity therefore it should be written in tyr cath syntax
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)      //it give an object in return
        console.log(`\n MONGODB connected !! DB HOSE ${connectionInstance.connection.host} `) 
    } catch (error) {
        console.log("MONGODB connection error: " , error);
        process.exit(1)
    }
}

export default connectDB 




//there is another way of connecting the database run the following code is written in ./src/index.js 
/*
const app = express()
//datable is in the another continent therefor it take time to get data from database therefore we use async await
(async () => {       //IIFE :- imminently invoke function execution ( function execute imminently after this index.js get render )  
    try {       //we might face some error in database connectivity therefore it should be written in tyr cath syntax
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
        app.listen(process.env,PORT,()=>{       //once the db is connect start the listing on  app
            console.log(`app is running at port ${process.env.PORT}` )
        })
    } catch (error) {
        console.log("error" , error);
        
    }
})() 
*/
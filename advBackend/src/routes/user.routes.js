import { Router } from "express";
import { registerUSer } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

// router.post("/register", upload.fields([
//     {
//         name:"avatar",
//         maxCount : 1
//     },
//     {
//         name:"coverImage",
//         maxCount:1
//     }]),registerUSer); 



router.route("/register").post(     //this will run the post command on register user method once you hit the /register
    upload.fields([     //using multer middleware to upload files( images ), as we are uploading multiple files we are using felid 
        {
            name:"avatar",  //this need to be synchronize with frontend 
            maxCount : 1    //how many file to accept
        },
        {
            name:"coverImage",  
            maxCount:1
        }
    ]),
    registerUSer)    



export default router
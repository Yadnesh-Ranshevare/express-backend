import { Router } from "express";
import { 
    changeCurrentPAssword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getWatchHistory, 
    loginUser, 
    logOutUser, 
    refreshAccessToken, 
    registerUSer, 
    updateAccountDetail, 
    updateUserAvatar, 
    updateUserCoverImage 
} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

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
    
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logOutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password",post(verifyJWT,changeCurrentPAssword))

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetail)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)       //as geeing info via url need to use dynamic url 

router.route("/history").get(verifyJWT,getWatchHistory)




export default router
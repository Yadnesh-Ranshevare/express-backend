import { asyncHandler } from "../utils/asyncHandeler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import  { uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiResponce.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async( userId ) => {
    // console.log("inside the generateAccessAndRefreshToken")
    try {
        const user = await User.findById(userId)
        //to generate access and refresh token
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        // console.log(user,accessToken,refreshToken)

        
        user.refreshToken = refreshToken        //storing the refresh token into the database
        await user.save({validateBeforeSave:false})     //saving the new database
        
        return{accessToken,refreshToken}    //name must be same while accepting this token
    } catch (error) {
        throw new apiError(500,"something went wrong while generating the access and refresh token")
    }
}



const registerUSer = asyncHandler(  async( req, res ) => {
    //basics controller which gives the response 
    // res.status(200).json({      //you can send any status code you want
    //     message:"every thing works"
    // })



    /* 
        steps to register the user:-
        1. get user detail from frontend( which details to take is depend on user model )
        2. validation - not empty
        3. check if user is already exist ( by userName & email )
        4. check for file ( images,avatar )
        5. upload them to cloudinary ( check upload )
        6. create user object - create entry call in db
        7. remove password and refresh token field from response( don't want to get info of password and refresh token as db returns the whole info )
        8. check fro the user creation
        9. return response
    */

    //step 1: get user detail from frontend
    const { fullName, email, username, password } = req.body        
    // console.log(email)


    //step 2:  validation - not empty
    // if(fullname===""){
    //     throw new apiError(400,"full name is required")
    // }
    // if(password===""){
    //     throw new apiError(400,"password is required")
    // }
    // if(email===""){
    //     throw new apiError(400,"email is required")
    // }
    // if(userName===""){
    //     throw new apiError(400,"user name is required")
    // }
    if(
        [ fullName, email, username, password ].some((felid)=>felid?.trim()==="")   //some will return the true or false based on condition for each value of an array
    ){
        throw new apiError(400,"all fields are required")
    }

    //step 3: check if user is already exist
    const existedUser = await User.findOne({  //find the first matching entry from the db
        $or:[{ username },{ email }]    //$ is use to write the query in mongodb, $or is use for multiple values
    })
    if( existedUser ){
        throw new apiError(409,"user is already exist")
    }


    //step 4:  check for file ( images,avatar )
    const avatarLocalPath = req.files?.avatar[0]?.path  //will give you a local path of an avatar image 
    //const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){    //isArray will check that is the given property is array or not, .length >0 :if it is a array the check is that array have any value or not 
        coverImageLocalPath = req.files.coverImage[0].path  //in case of true the cover image is exist
    }

   // console.log(req.files)      //return an array which will give you the info about the files you have uploaded
    if(!avatarLocalPath){   //checking is file upload or not on server
        throw new apiError(400,"avatar file is required")
    }

    //step 5: upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)   //this will take some time
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){        //checking is file upload or not on cloudinary
        throw new apiError(400,"avatar file is required")   
    }


    //step 6: create user object - create entry call in db
    const user = await User.create({        //in case of error asyncHandler will handel that error
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url  || "" ,      //if user doesn't uploaded the cover image store "" in db
        email,
        password ,
        username: username.toLowerCase()
    })

    //step 7: remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(   //.select remove the the selected felid
        "-password -refreshToken"       //here password and refresh token will get remove
    )

    // step 8: check fro the user creation
    if(!createdUser){
        throw new apiError(500,"something went wrong while registering the user")
    }

    // step : return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully ")
    )

})


const loginUser = asyncHandler( async( req,res ) => {
    /*
        step 1: get data from rhe user body
        step 2: check for the username and email
        step 3: find the user
        step 4: check password
        step 5: generate the access and refresh token
        step 5: send the cookie
    */

    //step 1: get the data from user body
    const {email,username,password} = req.body
    // console.log(email)

    //step 2: check for the username and email
    if(!(username || email)){
        throw new apiError(400,"username or email is required")
    }

    //step 3: find the user
    const user = await User.findOne({
        $or: [ { username },{ email } ]
    })
    // console.log(user);
    
    if(!user){
        throw new apiError(404, "user does not exist")
    }

    //step 4: check the password
    const isPAsswordValid = await user.isPasswordCorrect(password)  //this method will compare the password send by the user with the one available in db and return the true or false 
    if(!isPAsswordValid){
        throw new apiError(401,"invalid user credentials")
    }

    // step 5: generate the access and refresh token
    const { accessToken,refreshToken } = await generateAccessAndRefreshToken(user._id)  //this method will change the db soo you need to get the new data

    //step 6: send the cookie
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // console.log(loggedInUser)
    const option = {    //with this the cookie is only modified by the server not by frontend
        httpOnly: true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,option)       //setting the cookie
    .cookie("refreshToken",refreshToken,option)     //setting the cookie
    .json(
        new ApiResponse(
            200,
            {       //data
                user: loggedInUser
            },
            "user logged in successfully"
        )
    )
})


const logOutUser = asyncHandler( async(req,res)=>{
    //the main problem id to find the user to solve this we use middleware called auth which will add the current login user into the request body
    await User.findByIdAndUpdate(       //find the user from db and update it 
        //for finding the user
        req.user._id,       
        //for update
        {
            $set:{
                refreshToken:undefined  //removing the refresh token
            }
        },
        {
            new:true
        }
    )

    const option = {    //with this the cookie is only modified by the server not by frontend
        httpOnly: true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",option)      //clearing the cookie
    .clearCookie("refreshToken",option)     //clearing the cookie
    .json(
        new ApiResponse(
            200,{},"user log out successfully"
        )
    )
})


//this function will automatically generate new access and refresh token once access token expired
const refreshAccessToken = asyncHandler(async(req,res)=>{   //will refresh the access token once it expire
    const incomingRefreshToken = req.cookies.refreshToken  || req.body.refreshToken  //gating the refresh token form cookie or req body
    if(!incomingRefreshToken){
        throw new apiError(400,"unauthorized error")
    }
    // console.log(incomingRefreshToken)

   
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRETE)    //refresh token is formed on id only

        const user = await User.findById(decodedToken?._id) //getting user detail from decoded refresh token
        // console.log(user)
        if(!user){
            throw new apiError(401, "invalid refresh token")
        }
        // console.log(user?.refreshToken)
        if(incomingRefreshToken !== user?.refreshToken){        //checking is the refresh token get from the cookie is same as that of user
            throw new apiError(401,"refresh token s expired or used")
        }
        // console.log(incomingRefreshToken)
    
        const option={
            httpOnly: true,
            secure:true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)   //generating new refresh and access token  
        // console.log(accessToken);
        // console.log(refreshToken);
        
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",refreshToken,option)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken
                },
                "access token refreshed"
            )
        )
    } catch (error) {
        throw new apiError(401,"invalid refresh tokens")
    }


})


const changeCurrentPAssword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPAssword} = req.body

    const user = await User.findById(req.user?._id)       //req.user is via middleware

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)     //will return the true or false

    if(!isPasswordCorrect){     //chalking is old password is correct or not 
        throw new apiError(400,"invalid old password")
    }

    user.password = newPAssword     //if correct setting the new password
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"password change successfully"))
})

const getCurrentUser = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetch successfully"))
})

const updateAccountDetail = asyncHandler(async(req,res)=>{

    const { fullName,email } = req.body
    if(!fullName || !email){
        throw new apiError(400,"all felids are required")
    }

    const user = User.findByIdAndUpdate(        //to find the user and update it
        req.user?._id,
        {
            $set:{      //to set the data in db
                //can  use two syntax
                fullName,
                email:email
            }
        },
        {
            new:true    //this will return the updated info
        }
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"account detail successfully"))
})

const updateUserAvatar = asyncHandler (async(req,res)=>{
    //first use multer middleware
    const avatarLocalPath =  req.file?.path     //getting the path of the file

    if(!avatarLocalPath){
        throw new apiError(400,"avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)        //uploading the image on cloudinary

    if(!avatar.url){
        throw new apiError(400,"error while uploading the avatar")
    }

    const user = await User.findByIdAndUpdate(        //to find the user and update it
        req.user?._id,
        {
            $set:{      //to set the data in db
                avatar:avatar.url
            }
        },
        {
            new:true        //this will return the updated info
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"avatar updated successfully")
    )
} )

const updateUserCoverImage = asyncHandler (async(req,res)=>{
    //first use multer middleware
    const CoverImageLocalPath =  req.file?.path     //getting the path of the file

    if(!CoverImageLocalPath){
        throw new apiError(400,"CoverImage file is missing")
    }

    const CoverImage = await uploadOnCloudinary(CoverImageLocalPath)        //uploading the image on cloudinary

    if(!CoverImage.url){
        throw new apiError(400,"error while uploading the CoverImage")
    }

    const user = await User.findByIdAndUpdate(        //to find the user and update it
        req.user?._id,
        {
            $set:{      //to set the data in db
                coverImage:CoverImage.url
            }
        },
        {
            new:true        //this will return the updated info
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Cover Image updated successfully")
    )
} )
export { 
    registerUSer,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPAssword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage
 }

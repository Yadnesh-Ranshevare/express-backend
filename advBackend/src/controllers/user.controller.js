import { asyncHandler } from "../utils/asyncHandeler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import  { uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiResponce.js"

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
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){   //checking is file upload or not on server
        throw new apiError(400,"avatar file is required")
    }

    //step 5: upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)   //this will take some time
    const coverImage = await uploadOnCloudinary(avatarLocalPath)

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

export { registerUSer }

import { asyncHandler } from "../utils/asyncHandeler.js"

const registerUSer = asyncHandler(  async( req, res ) => {
    res.status(200).json({      //you can send any status code you want
        message:"every thing works"
    })
})

export { registerUSer }

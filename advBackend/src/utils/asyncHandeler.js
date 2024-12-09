const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((error) => next(error))
    }
}

export {asyncHandler}





/*
// const asyncHandler = () = {}
// const asyncHandler = (fu) => { () => {} }
const asyncHandler = (fu) => async(req,res,next) => {      //fu is function
    try {
        await fn(req,res,next)
    } catch (error) {
        res.send(error.code || 500).json({
            success: false,
            message: error.message
        })
    }   
}
*/

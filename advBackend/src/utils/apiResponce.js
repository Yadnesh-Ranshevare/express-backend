class ApiResponse{
    constructor(
        statusCode,
        data,
        massage = 'success'
    ){
        this.statusCode = statusCode
        this.data = data
        this.massage = massage
        this.success = statusCode < 400         //status code must be smaller than 400
        // console.log("into api response")
    }
}
export {ApiResponse}
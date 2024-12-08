class apiResponse{
    constructor(
        statusCode,
        data,
        massage = 'success'
    ){
        this.statusCode = statusCode
        this.data = data
        this.success = statusCode < 400         //status code must be smaller than 400
    }
}
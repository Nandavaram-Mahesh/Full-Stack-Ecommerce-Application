/*
    

 */


class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors=[],
        stack=""
        ){
        super(message)
        this.statusCode = statusCode
        this.errors=errors
        this.data = null
        this.success = false
        
        if(this.stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export {ApiError}
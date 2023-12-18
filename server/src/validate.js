import { validationResult } from "express-validator";
import { ApiError } from "./utils/ApiError";

/*
  This is the validate middleware responsible to centralize the error checking done by the `express-validator` `ValidationChains`.
 * This checks if the request validation has errors.
 * If yes then it structures them and throws an {@link ApiError} which forwards the error to the {@link errorHandler} middleware which throws a uniform response at a single place
*/

const validate = ({req,res})=>{
    
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next()
    } 
    const extractedErrors=[]
    errors.array().map((error)=>extractedErrors.push({[error.path]:error.msg}))

    // 422: Unprocessable Entity
    throw new ApiError(422, "Received data is not valid", extractedErrors)
}


export{validate}
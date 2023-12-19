import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log(`req.cookies:${req.cookies}`)
    console.log(`token:${token}`)

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }
    try {

        const decryptedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decryptedToken._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        );

        if (!user) {
            // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
            // Then they will get a new access token which will allow them to refresh the access token without logging out the user
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;
        next()
    }
    catch (error) {
        // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
        // Then they will get a new access token which will allow them to refresh the access token without logging out the user
        throw new ApiError(401, error?.message || "Invalid access token");
    }

})

const verifyPermission =(roles=[])=>
     asyncHandler(async (req,res,next)=>{
        
        if (!req.user?._id) {
            throw new ApiError(401, "Unauthorized request");
        }

        if(roles.includes(req.user?.role)){
            next()
        }
        else {
            throw new ApiError(403, "You are not allowed to perform this action");
          }

})

export {verifyJWT,verifyPermission}
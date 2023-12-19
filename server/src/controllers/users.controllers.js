import { userLoginType, userRolesEnum } from "../constants.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js"
import crypto from "crypto";

const generateAccessAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId)
    
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }
    }
    catch(error){
        throw new ApiError(
            500,
            "Something went wrong while generating the access token"
          );
    }
    

}

const registerUser = asyncHandler(async (req, res) => {

    const { userName, email, password, role } = req.body

    const existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists", []);
    }

    const user = await User.create({
        userName,
        password,
        email,
        role: role || userRolesEnum.USER,
    })

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.userName,
            `${req.protocol}://${req.get(
                "host"
            )}/api/v1/users/verify-email/${unHashedToken}`
        ),
    }
    )

    const createdUser = await User.findById(user._id).select("-password -emailVerificationToken -emailVerificationExpiry")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(new ApiResponse(
        200,
        { user: createdUser },
        "Users registered successfully and verification email has been sent on your email."
    ))

})

const loginUser = asyncHandler(async (req, res) => {

    const { userName, email, password } = req.body

    if (!userName && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    if (user.loginType !== userLoginType.EMAIL_PASSWORD) {
        // If user is registered with some other method, we will ask him/her to use the same method as registered.
        // This shows that if user is registered with methods other than email password, he/she will not be able to login with password. Which makes password field redundant for the SSO
        throw new ApiError(
            400,
            "You have previously registered using " +
            user.loginType?.toLowerCase() +
            ". Please use the " +
            user.loginType?.toLowerCase() +
            " login option to access your account."
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    const options = {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
    }

    return (
            res
            .status(200)
            .cookie("accessToken", accessToken, options) // set the access token in the cookie
            .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
            .json(new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
                "User logged in successfully"
            ))
    )

})

const logoutUser = asyncHandler(async (req,res)=>{
     await User.findByIdAndUpdate(req.user?._id,{ $set: { refreshToken: undefined }},{ new: true })

    const options = {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
      };
    
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));

})
const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params
    if (!verificationToken) {
        throw new ApiError(400, "Email verification token is missing", [])
    }

    // generate a hash from the token that we are receiving
    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    let user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError(489, "Token is invalid or expired");
    }

    user.emailVerificationToken = undefined
    user.emailVerificationExpiry = undefined
    user.isEmailVerified = true

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, { isEmailVerified: true }, "Email is verified"));


}




export { registerUser, loginUser, verifyEmail ,logoutUser}
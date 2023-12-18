import { userRolesEnum } from "../constants.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js"

const registerUser = asyncHandler(async (req, res) => {

    const { userName, email, password, role } = req.body

    const existingUser = User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existingUser) {
        ApiError(409, "User with email or username already exists", []);
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

    const createdUser = User.findById(user._id).select("-password -emailVerificationToken -emailVerificationExpiry")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(new ApiResponse(
        200,
        { user: createdUser },
        "Users registered successfully and verification email has been sent on your email."
    ))

})

const loginUser = () => {

}


const verifyEmail = async () => {
    const { verificationToken } = req.param

    if (!verificationToken) {
        throw new ApiError(400, "Email verification token is missing")
    }

    // generate a hash from the token that we are receiving
    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

   let user =  await User.findOne({
    emailVerificationToken:hashedToken,
    emailVerificationExpiry:{ $gt: Date.now()}
    })

    if(!user){
        throw new ApiError(489, "Token is invalid or expired");
    }

    user.emailVerificationToken=undefined
    user.emailVerificationExpiry=undefined
    user.isEmailVerified = true
    
    await user.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(new ApiResponse(200, { isEmailVerified: true }, "Email is verified"));


}
export { registerUser, loginUser, verifyEmail }
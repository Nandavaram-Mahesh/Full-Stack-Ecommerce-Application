import { Router } from "express";
import { loginUser, logoutUser, registerUser, verifyEmail } from "../controllers/users.controllers.js";

import { validate } from "../validate.js";
import { userRegisterValidator,userLoginValidator } from "../validators/users.validations.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()


// Unsecured route
router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,loginUser)
router.route("/verify-email/:verificationToken").get(verifyEmail);

// secured Routes
router.route("/logout").post(verifyJWT,logoutUser)


export default router;

import { Router } from "express";
import { loginUser, registerUser, verifyEmail } from "../controllers/users.controllers.js";

import { validate } from "../validate.js";
import { userRegisterValidator,userLoginValidator } from "../validators/users.validations.js";

const router = Router()


// Unsecured route
router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,loginUser)
router.route("/verify-email/:verificationToken").get(verifyEmail);
// secured Routes


export default router;

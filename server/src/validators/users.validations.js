import { body } from 'express-validator';
import { availableUserRoles } from '../constants.js';
const userRegisterValidator = () => {
    return [
        body("email")
          .trim()
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Email is invalid"),
        body("userName")
          .trim()
          .notEmpty()
          .withMessage("Username is required")
          .isLowercase()
          .withMessage("Username must be lowercase")
          .isLength({ min: 3 })
          .withMessage("Username must be at lease 3 characters long"),
        body("password").trim().notEmpty().withMessage("Password is required"),
        body("role")
          .optional()
          .isIn(availableUserRoles)
          .withMessage("Invalid user role"),
      ];
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .trim()
            .notEmpty().withMessage("Email Required")
            .isEmail().withMessage("Provide proper email address")
            .isLowercase().withMessage("Email must be lowercase")
        ,
        body("userName")
            .trim()
            .notEmpty()
            .withMessage("UserName Required")
            .isLowercase()
        ,
        body("password")
        .notEmpty().withMessage("Password is Required")
    ]
}

export { userRegisterValidator,userLoginValidator }
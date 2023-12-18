import { body } from 'express-validator';
import { availableUserRoles } from '../constants.js';
const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email Required")
            .isEmail()
            .isLowercase()
            .withMessage("Provide proper email address")
        ,
        body("userName")
            .trim()
            .notEmpty()
            .withMessage("UserName Required")
            .isLowercase()
            .isLength({ min: 3 }).withMessage("Username must be at lease 3 characters long")
        ,
        body("password")
            .trim()
            .notEmpty().withMessage("Password Required")
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[0-9]/).withMessage('Password must contain at least one digit')
            .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
            .isLength({ min: 6, max: 15 }).withMessage('Password must be between 6 and 15 characters')
        ,
        body("role")
            .optional()
            .isIn(availableUserRoles)
            .withMessage("Invalid User Role")
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .trim()
            .notEmpty().withMessage("Email Required")
            .isEmail().withMessage("Provide proper email address")
            .isLowercase()
        ,
        body("userName")
            .trim()
            .notEmpty()
            .withMessage("UserName Required")
            .isLowercase()
        ,
        body("password")
        .isEmpty().withMessage("Password is Required")
    ]
}

export { userRegisterValidator,userLoginValidator }
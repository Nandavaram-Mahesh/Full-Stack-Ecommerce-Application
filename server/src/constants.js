const DB_NAME = "Ecommerce"

const userLoginType={
    GOOGLE:"GOOGLE",
    FACEBOOK:"FACEBOOK",
    LINKEDIN:"LINKEDIN",
    TWITTER:"TWITTER",
    GITHUB:"GITHUB",
    EMAIL_PASSWORD:"EMAIL_PASSWORD"
} 

const availableSocialLoginTypes = Object.values(userLoginType)


const userRolesEnum={
    ADMIN:"ADMIN",
    USER:"USER"
}

const availableUserRoles = Object.values(userRolesEnum)
const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

export{DB_NAME,userLoginType,availableSocialLoginTypes,userRolesEnum,availableUserRoles,USER_TEMPORARY_TOKEN_EXPIRY}
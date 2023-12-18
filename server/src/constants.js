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

const availableUserRoles = Object.values(userRoles)

export{DB_NAME,userLoginType,availableSocialLoginTypes,userRolesEnum,availableUserRoles}
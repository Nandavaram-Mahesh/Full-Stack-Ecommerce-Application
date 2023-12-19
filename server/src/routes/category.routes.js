import { Router } from "express";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middlewares.js";
import { userRolesEnum } from "../constants.js";
import { validate } from "../validate.js";
import { createCategory, deleteCategory, getAllCategories, getCategorybyId, updateCategory } from "../controllers/category.controllers.js";
import { categoryRequestBodyValidator } from "../validators/category.validations.js";
import { mongoIdPathVariableValidator } from "../validators/mongodb.validators.js";


const router = Router()


router.route("/").post(verifyJWT,verifyPermission([userRolesEnum.ADMIN]),categoryRequestBodyValidator(),validate,createCategory).get(getAllCategories)

router.route("/:categoryId")
.get(mongoIdPathVariableValidator("categoryId"),validate,getCategorybyId)
.delete( 
    verifyJWT,
    verifyPermission([userRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("categoryId"),
    validate,
    deleteCategory
)
.patch(
    verifyJWT,
    verifyPermission([userRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("categoryId"),
    validate,
    updateCategory
)



export default router; 
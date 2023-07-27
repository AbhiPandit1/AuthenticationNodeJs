import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/authMiddleware.js";



const router=express.Router()

//Route Level middleware to protect Route

router.use('./changepassword',checkUserAuth)
router.use('./loggedUser',checkUserAuth)


//public route-->without login access
router.route("/register").post(UserController.userRegistration)

router.route("/login").post(UserController.userLogin)
router.route('./reset-password/:id/:token',UserController.resetPassword)




//private route-->with login access
router.route("/changePassword").post(UserController.cahngePassword)
router.route('./loggedUser').get(UserController.logUser)


export default router
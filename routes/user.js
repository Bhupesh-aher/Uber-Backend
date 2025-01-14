const express = require("express")
const userRouter = express.Router();
const {body} = require("express-validator")
const userController = require("../controllers/userController")
const auth = require("../middlewares/auth")


userRouter.post("/register", [
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullname.firstname').isLength({min: 3}).withMessage("First Name must be at least 3 characters long"),
    body('password').isLength({min: 6}).withMessage("password must be at least 6 characters long")
], userController.registerUser)


userRouter.post("/login", [
    
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min: 6}).withMessage("password must be at least 6 characters long")
], userController.loginUser)


userRouter.get("/profile", auth.userAuth, userController.getUserProfile)






module.exports = userRouter

import userController from "../controllers/userController.js";
import { Router } from "express";

const userRouter = new Router()
userRouter.get('/users/all', userController.getAllUsers)
userRouter.get('/users/one-user', userController.getOneUser)
userRouter.post('/registration', userController.registration)
userRouter.post('/users/update-bio', userController.updateUserBio)
userRouter.post('/users/update-photo', userController.updatePhoto)
userRouter.post('/users/update-info', userController.updateUser)
userRouter.post('/reset-password-request', userController.sendLinkOnEmail)
userRouter.get('/users/activation/:link', userController.activation)
userRouter.get('/users/reset-password/:link', userController.CheckedEmail)
userRouter.post('/login', userController.login)

export {userRouter}
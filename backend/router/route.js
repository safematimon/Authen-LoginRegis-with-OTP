import { Router } from "express";
import * as controller from "../controller/appController.js";
import Auth,{localVariables} from '../middleware/auth.js'
import { registerMail } from "../controller/mailer.js";

const router = Router();

// POST
router.route('/register').post(controller.register)
router.route('/registerMail').post(registerMail) //send email
router.route('/authenticate').post(controller.verifyUser,(req,res)=> res.end()) //authen user
router.route('/login').post(controller.verifyUser,controller.login) //login app

// GET
// router.route('/').get(controller.register)
router.route('/user/:username').get(controller.getUser) //user with username
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP) //gen random OPT
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP) //vify gen OTP
router.route('/createResetSession').get(controller.createResetSession) //reset all variable

// PUT
router.route('/updateuser').put(Auth,controller.updateUser) //update user profile
router.route('/resetpassword').put(controller.verifyUser,controller.resetPassword) //use to reset password 

export default router
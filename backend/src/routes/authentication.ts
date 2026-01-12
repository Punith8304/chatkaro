import { Router } from "express";
import { loginController, signUpController, checkAuthentication } from "../controllers/authenticationController.js";


const router = Router()

router.post("/login", loginController) //{userEmail, userPassword}
router.post("/sign-up", signUpController) //{userEmail, userPassword, userName}
router.get("/check-authentication", checkAuthentication) //session {userName, login}



export default router;
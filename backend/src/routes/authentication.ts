import { Router } from "express";
import { loginController, signUpController, checkAuthentication, logout } from "../controllers/authenticationController.js";


const router = Router()

router.post("/login", loginController) //{userName, userPassword}
router.post("/sign-up", signUpController) //{userEmail, userPassword, userName}
router.get("/check-authentication", checkAuthentication) //session {userName, login}
router.get("/logout", logout) //session destroy



export default router;
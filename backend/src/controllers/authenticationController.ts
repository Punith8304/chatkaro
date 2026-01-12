import type { Request, Response } from "express";

import { createHash } from "../utils/passwordEncryption.js";


import { checkUser, createUser, type userAunthenticationReturnType } from "../services/userAuthenticationServices.js";

interface UserLoginDetails {
    userEmail: string;
    userPassword: string;
}
interface UserSignUpDetails extends UserLoginDetails {
    userName: string
}



export const loginController = async (req: Request, res: Response) => {

    const userDetails: UserLoginDetails = req.body;
    const { userEmail, userPassword } = userDetails;
    console.log("login request received")
    try {
        const userExists: userAunthenticationReturnType = await checkUser(userEmail, userPassword)
        if (userExists?.userLogged) {
            req.session.user = {
                userName: userExists?.user?.userName as string,
                login: true
            }
        }
        res.json({ ...userExists, status: 200 })
    } catch (error) {
        console.log(error)
        res.json({ status: 400, error: error })
    }

}

export const signUpController = async (req: Request, res: Response) => {
    const UserDetails: UserSignUpDetails = req.body;
    const { userEmail, userPassword, userName } = UserDetails
    console.log("signup request received")
    try {
        const checkingUser: userAunthenticationReturnType = await checkUser(userEmail, userName)
        if (checkingUser.userExists) {
            return res.json({ status: 400, userExists: true, userEmail, userName })
        }
        const createdHash: string = await createHash(userPassword);
        await createUser(userName, createdHash, userEmail)
        req.session.user = {
            userName: userName,
            login: true
        }
        res.json({ status: 200, createdUser: { userName, userEmail } })
    } catch (error) {
        console.log(error)
        res.json({ status: 400, error: error })
    }
}


export const checkAuthentication = async (req: Request, res: Response) => {
    const user = req.session.user
    try {
        res.json({status: 200, user: {login: true, userName: user?.userName}})
    } catch (error) {
        console.log(error)
        res.json({status: 400, user: {login: false, userName: ""}})
    }
}


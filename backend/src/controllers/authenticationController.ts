import type { Request, Response } from "express";

import { createHash } from "../utils/passwordEncryption.js";


import { checkUser, createUser, type userAunthenticationReturnType } from "../services/userAuthenticationServices.js";

interface UserLoginDetails {
    userName: string;
    userPassword: string;
}
interface UserSignUpDetails extends UserLoginDetails {
    userEmail: string
}



export const loginController = async (req: Request, res: Response) => {
    const { username: userName, password: userPassword } = req.body;


    try {
        const userExists: userAunthenticationReturnType = await checkUser(userName, userPassword)
        if (userExists?.userLogged) {
            req.session.user = {
                userName: userExists?.user?.userName as string,
                login: true
            }
        }
        res.json({ ...userExists, status: 200 })
        // {userExists: false, status: 200} if no user
        // {userExists: true, userLogged: true | false, user: userName} if user exists and after checking password
    } catch (error) {
        console.log(error)
        res.json({ status: 400, error: error, login: false })
    }

}

export const signUpController = async (req: Request, res: Response) => {
    const { useremail: userEmail, password: userPassword, username: userName } = req.body
    console.log("signup request received")
    try {
        const checkingUser: userAunthenticationReturnType = await checkUser(userName, userPassword, userEmail)
        if (checkingUser.userExists) {
            return res.json({ status: 400, userExists: true, userName })
        }
        const createdHash: string = await createHash(userPassword);
        await createUser(userName, createdHash, userEmail)
        req.session.user = {
            userName: userName,
            login: true
        }
        res.json({ status: 200, userLogged: true, createdUser: { userName } })

        // if user exists {status: 400, userExists: true, userName}
        // if successful {status: 200, login: true, createdUser: {userName}}
    } catch (error) {
        console.log(error)
        res.json({ status: 400, userLogged: false, error: error })
    }
}


export const checkAuthentication = async (req: Request, res: Response) => {
    const user = req.session.user
    try {
        console.log(user)
        if (user) {
            return res.json({ status: 200, user: { login: true, userName: user?.userName } })
        }
        res.json({ status: 401, user: { login: false, userName: "" } })

    } catch (error) {
        console.log(error)
        res.json({ status: 400, user: { login: false, userName: "" } })
    }
}


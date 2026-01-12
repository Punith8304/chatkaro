import userModel from "../models/userModel.js";
import { checkPassword } from "../utils/passwordEncryption.js";


type userType = {
    userName: string;
    userEmail: string;
    userPassword: string
}

export type userAunthenticationReturnType = {
    userExists?: boolean;
    userLogged?: boolean;
    user?: {
        userEmail: string,
        userName: string
    }
}
export const createUser = async (userName: string, userHashedPassword: string, userEmail: string): Promise<boolean> => {
    try {
        const User = new userModel({
            userEmail,
            userPassword: userHashedPassword,
            userName
        })
        await User.save()
        return (true)
    } catch (error) {
        console.log(error)
        throw new Error("account creation failed")
    }
}



export const checkUser = async (userEmail: string, userPassword?: string, userName?: string): Promise<userAunthenticationReturnType> => {
    try {
        const userResult: userType | null = await userModel.findOne({ userEmail })
        if (userName) {
            const userNameSearchResult: userType | null = await userModel.findOne({ userName })
            return {
                userExists: !!userNameSearchResult
            }
        }
        if (!userResult) {
            return {
                userExists: false
            }
        } else if (userPassword) {
            const isPasswordValid: boolean = await checkPassword(userPassword, userResult.userPassword)
            return {
                userExists: true,
                userLogged: isPasswordValid,
                user: {
                    userEmail: userResult.userEmail,
                    userName: userResult.userName
                }
            }
        }
        return {
            userExists: true
        }


    } catch (error) {
        console.log(error)
        throw new Error("user checking error")
    }
}



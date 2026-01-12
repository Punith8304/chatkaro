import bcrypt from "bcrypt";


export const createHash = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const createdHash = await bcrypt.hash(password, saltRounds)
    return createdHash
}

export const checkPassword = async (userPassword: string, actualPassword: string): Promise<boolean> => {
    const checkPasswordResult = await bcrypt.compare(userPassword, actualPassword);
    return checkPasswordResult
}
import type { NextFunction } from "express"
import { Socket, type ExtendedError } from "socket.io"
import userModel from "../models/userModel.js"
import { getSocketID, updateSocketID } from "./userAuthenticationServices.js"

const connectionCB = (socket: Socket) => {
    console.log("connection succeed")

    socket.emit("session", {
        sessionID: (socket as any).sessionID,
        userID: (socket as any).userID
    })


    socket.on("private message", ({ content, to }) => {
        (async function () {
            const socketID: string | false = await getSocketID(to);
            if (!socket) {
                (socket as any).to(socketID).emit("private message", {
                    content,
                    from: (socket as any).username,
                    to,
                })
            }
        })
    })
}



export const checkConnection = (socket: Socket, next: (err?: ExtendedError) => void): void => {
    (async () => {
        const username = socket.handshake.auth.username;
        await updateSocketID((socket as any).id, username);
        (socket as any).username = username
        next()
    })()
}
export default connectionCB

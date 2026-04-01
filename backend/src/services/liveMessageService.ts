import type { NextFunction } from "express"
import { Socket, type ExtendedError } from "socket.io"
import userModel from "../models/userModel.js"
import { getSocketID, updateSocketID } from "./userAuthenticationServices.js"
import { sendMessage } from "./messagingService.js"
import { getUserFriendsList, suggestedFriendsUsingLimit } from "./friendListServices.js"
import { getSuggestedFriends } from "../controllers/userChatController.js"

const connectionCB = (socket: Socket) => {
    console.log("connection succeed")

    socket.on("private-message", ({ content, to }) => {

        (async function () {
            const socketID: string | false = await getSocketID(to);
            const sender = (socket as any).handshake.auth.user;
            // console.log(sender, socketID, to,  "socket details");
            await sendMessage({ sender, receiver: to, message: content });
            (socket as any).to(socketID).emit("send-message", {
                content,
                from: sender,
                to,
                date: new Date().toLocaleDateString("en-GB", {timeZone: "Asia/Kolkata"})
            }); 
        })()
    })
    socket.on("update-friends",() => {
        (async function() {
            const user = (socket as any).handshake.auth.user;
            const friendsList = await getUserFriendsList(user);
            console.log(friendsList, "getting update-friends")
            const suggestedList = await suggestedFriendsUsingLimit(user);
            (socket as any).emit("updated-friends", {
                updatedList: friendsList.friendsList,
                peers: suggestedList
            });
        })();
    })
}



export const checkConnection = (socket: Socket, next: (err?: ExtendedError) => void): void => {
    (async () => {
        const username = socket.handshake.auth.user;
        await updateSocketID((socket as any).id, username);
        // (socket as any).username = username
        next()
    })()
}
export default connectionCB

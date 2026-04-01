import chatModel from "../models/userChatModel.js";
import type { chatHistoryType } from "../controllers/userChatController.js";
import { updateUnReadCount, changeChatList } from "./friendListServices.js";
import { error } from "console";

interface msgDetailsType {
    sender: string;
    receiver: string;
    message: string
}

interface getChatType extends chatHistoryType {
    receiver: string,
    sender: string
}


export type chatMessage = {
    sender: string;
    message: string;
    date: string
}
export const sendMessage = async ({ sender, receiver, message }: msgDetailsType): Promise<boolean> => {

    try {
        // console.log("receiving", sender, receiver, message)
        const checkChatExists = await chatModel.findOne({ users: { $all: [sender, receiver] } }, { chatHistory: 1 })
        await updateUnReadCount(sender, receiver)
        // console.log(checkChatExists)
        if (!checkChatExists) {
            const createNewChat = new chatModel({
                users: [sender, receiver],
                chatHistory: [{
                    sender: sender,
                    message: message,
                    date: new Date().toLocaleDateString("en-GB", {timeZone: "Asia/Kolkata"})
                }]
            })
            // console.log({ section: "sending messages", status: true })
            createNewChat.save()
            return true
        }
        // console.log(sender, receiver, message)
        const result = await chatModel.updateOne({ users: { $all: [sender, receiver] } },
            {
                $push: {
                    chatHistory: { sender: sender, message: message, read: false, date: new Date().toLocaleDateString("en-IN") }
                }
            }
        )
        await changeChatList(receiver, sender)

        // won't working even after using ai so following normal method 
        // await chatModel.findOneAndUpdate({ users: { $all: [sender, receiver] } },
        //     {
        //         $setOnInsert: {
        //             users: [sender, receiver]
        //         },


        //         $push: {
        //             chatHistory: {
        //                 $each: [{ sender: "punith", message: "hi", read: false }],
        //                 $position: 0
        //             }
        //         }
        //     },
        //     { upsert: true }
        // )
        // console.log({ section: "sending messages", status: true })
        return true
    } catch (error) {
        console.log({ section: "sending messages", status: false, error })
        return false
    }
}



export const getChat = async ({ sender, receiver, loadedMsgsCount }: getChatType): Promise<chatMessage[] | { failedFetchMessages: boolean }> => {
    try {
        await chatModel.updateOne({ users: { $all: [sender, receiver] } }, { $set: { 'chatHistory.$[x].read': true } }, { arrayFilters: [{ "x.sender": receiver }] });

        let chatHistory = (await chatModel.findOne(
            { users: { $all: [sender, receiver] } }
            // { chatHistory: { $slice: [start, end] } }
        ));
        // let start = chatHistoryLength -
        // console.log({ section: "getting chat", value: chatHistory })
        if (chatHistory) {
            const length = chatHistory.chatHistory.length
            return chatHistory.chatHistory.slice(length - loadedMsgsCount - 30, length - loadedMsgsCount) as chatMessage[]
        }
        return []
    } catch (error) {
        console.log({ section: "getting chat", error })
        return { failedFetchMessages: true }
    }
}






import chatModel from "../models/userChatModel.js";
import type { chatHistoryType } from "../controllers/userChatController.js";
import { error } from "console";

interface msgDetailsType {
    sender: string;
    receiver: string;
    message: string
}

interface getChatType extends chatHistoryType {
    receiver: string
}


export type chatMessage = {
    sender: string;
    message: string;
    timeStamp: Date
} 
export const sendMessage = async ({ sender, receiver, message }: msgDetailsType): Promise<boolean> => {
    const checkChatExists = await chatModel.findOne({ users: { $all: [sender, receiver] } }, { chatHistory: 1 })
    try {
        if (!checkChatExists) {
            const createNewChat = new chatModel({
                users: [sender, receiver],
                chatHistory: [{
                    sender: sender,
                    message: message
                }]
            })
            console.log({section: "sending messages", status: true})
            createNewChat.save()
            return true
        }
        await chatModel.updateOne({ users: { $all: [sender, receiver] } }, {
            $push: {
                chatHistory: {
                    $each: [{ sender: sender, message: message }],
                    $position: 0
                }
            }
        })
        console.log({section: "sending messages", status: true})
        return true
    } catch (error) {
        console.log({section: "sending messages", status: true})
        return false
    }
}



export const getChat = async ({ sender, receiver, start=0, end=9 }: getChatType): Promise<chatMessage[] | {failedFetchMessages: boolean}> => {
    try {
        const chatHistory = await chatModel.findOne(
            { users: { $all: [sender, receiver] } },
            { chatHistory: { $slice: [start, end] } }
        )
        await chatModel.updateOne({ users: { $all: [sender, receiver] } }, {$set: {'chatHistory.$.read': true}})
        console.log({section: "getting chat", value: chatHistory})
        return chatHistory?.chatHistory as chatMessage[]
    } catch (error) {
        console.log({section: "getting chat", error})
        return {failedFetchMessages: true}
    }
}






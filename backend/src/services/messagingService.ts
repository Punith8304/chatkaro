import chatModel from "../models/userChatModel.js";
import type { chatHistoryType } from "../controllers/userChatController.js";
import { updateUnReadCount } from "./friendListServices.js";
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
    
    try {
        const checkChatExists = await chatModel.findOne({ users: { $all: [sender, receiver] } }, { chatHistory: 1 })
        await updateUnReadCount(sender, receiver)
        if (!checkChatExists) {
            const createNewChat = new chatModel({
                users: [sender, receiver],
                chatHistory: [{
                    sender: sender,
                    message: message
                }]
            })
            console.log({ section: "sending messages", status: true })
            createNewChat.save()
            return true
        }
        console.log(sender, receiver, message)
        await chatModel.updateOne({ users: { $all: [sender, receiver] } },
            {
                $push: {
                    chatHistory: {
                        $each: [{ sender: "punith", message: "hi", read: false }],
                        $position: 0
                    }
                }
            }
        )
        // cannot done even using ai so following normal method 
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
        console.log({ section: "sending messages", status: true })
        return true
    } catch (error) {
        console.log({ section: "sending messages", status: false, error })
        return false
    }
}



export const getChat = async ({ sender, receiver, start = 0, end = 9 }: getChatType): Promise<chatMessage[] | { failedFetchMessages: boolean }> => {
    try {
        
        await chatModel.updateOne({ users: { $all: [sender, receiver] } }, { $set: { 'chatHistory.$[x].read': true } }, {arrayFilters: [{"x.sender": receiver}]})
        const chatHistory = await chatModel.findOne(
            { users: { $all: [sender, receiver] } },
            { chatHistory: { $slice: [start, end] } }
        )
        console.log({ section: "getting chat", value: chatHistory })
        if(chatHistory) {
            return chatHistory?.chatHistory as chatMessage[]
        }
        return []
    } catch (error) {
        console.log({ section: "getting chat", error })
        return { failedFetchMessages: true }
    }
}






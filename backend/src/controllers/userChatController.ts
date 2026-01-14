import type { Request, Response } from "express"


import { sendMessage, getChat, type chatMessage } from "../services/messagingService.js"
import { getUserFriendsList, changeChatList, addToFriendsList, searchFriends, type userModelFriendListType } from "../services/friendListServices.js"



export type messageResultType = {
    sent: boolean
}

export type chatHistoryType = {
    sender: string;
    start: number;
    end: number
}

export const getChatHistory = async (req: Request, res: Response) => {
    const receiver: string = req.params.userName!;
    const { sender, start, end }: chatHistoryType = req.body;
    try {
        const chatHistory: chatMessage[] | { failedFetchMessages?: boolean } = await getChat({ sender, receiver, start, end })
        console.log(chatHistory, "chat history")
        if (!Array.isArray(chatHistory)) {
            if ("failedFetchMessages" in chatHistory) {
                throw new Error("Failed to fetch messages")
            }
        }
        res.json({ messages: chatHistory ? chatHistory : [], status: true })
    } catch (error) {
        console.log(error)
        res.json({ status: 400, messages: [], fetched: false })
    }
}

export const sendMessageToUser = async (req: Request, res: Response) => {
    const receiver: string = req.params.userName!
    const { sender, message } = req.body;
    try {
        // const addToFriends = await addToFriendsList({ sender, receiver })
        // if (!addToFriends) {
        //     throw new Error("Adding to friends failed")
        // }
        const messageSend: boolean = await sendMessage({ sender, receiver, message })
        const chatListModify = await changeChatList(receiver, sender)
        if (!messageSend) {
            return res.json({ status: 400, message: "message sending failed" })
        }
        res.json({ status: 200, message: "message sent successfully", modifiedChatList: chatListModify.friendsList })
    } catch (error) {
        console.log(error)
        const message = error instanceof Error ? error.message : "message sending failed"
        res.json({ status: 400, message: message })
    }
}


export const getFriendsList = async (req: Request, res: Response) => {
    const user: string = req.body.user
    try {
        const friendsList: { success: boolean; friendsList: userModelFriendListType[] } = await getUserFriendsList(user);
        console.log(friendsList)
        if (friendsList.success) {
            return res.json({ friendsList: friendsList.friendsList, fetched: true })
        }
        res.json({ friendsList: [], fetched: false })
    } catch (error) {
        console.log(error)
        res.json({ friendsList: [], fetched: false })
    }
}



export const getSearchQueryUsersList = async (req: Request, res: Response) => {
    try {
        const searchQuery: string = req.query.search as string;
        if(!searchQuery || searchQuery.trim() === "") {
            return res.status(400).json({message: "searching query cannot be empty", fetched: false})
        }
        const resultForSearch: {fetched: boolean, result: string[]} = await searchFriends(searchQuery);
        if (!resultForSearch.fetched) {
            return res.status(400).json({fetched: false, message: "unable to fetch users"})
        }
        res.status(200).json({fetched: true, searchResult: resultForSearch.result})
    } catch (error) {
        console.log(error)
        res.status(400).json({fetched: false, message: "unable to fetch users"})
    }
}







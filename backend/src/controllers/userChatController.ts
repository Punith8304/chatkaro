import type { Request, Response } from "express"


import { sendMessage, getChat, type chatMessage } from "../services/messagingService.js"
import { getUserFriendsList, changeChatList, searchFriends, type userModelFriendListType, suggestedFriendsUsingLimit, checkUserExisits } from "../services/friendListServices.js"



export type messageResultType = {
    sent: boolean
}

export type chatHistoryType = {
    loadedMsgsCount: number;
}

export const getChatHistory = async (req: Request, res: Response) => {
    const receiver: string = req.params.userName!;
    const sender: string = req.session.user!.userName
    const  loadedMsgsCount: number = Number(req.query.loadedMsgsCount);
    try {
        const chatHistory: chatMessage[] | { failedFetchMessages?: boolean } = await getChat({ loadedMsgsCount, sender, receiver })
        // console.log(chatHistory, "chat history")
        if (!Array.isArray(chatHistory)) {
            if ("failedFetchMessages" in chatHistory) {
                throw new Error("Failed to fetch messages")
            }
        }
        res.json({ messages: chatHistory ? chatHistory : [], status: true })

        // if failed {status: messages: [], fetched: false}
        // if success { messages: chatHistory, status: true}
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
    const user: string = req.session.user?.userName!
    try {
        const friendsList: { success: boolean; friendsList: userModelFriendListType[] } = await getUserFriendsList(user);
        if (friendsList.success) {
            return res.json({ friendsList: friendsList.friendsList, fetched: true })
        }
        res.json({ friendsList: [], fetched: false })

        //if fetched {friendsList: [_id: new ObjectId, chatFriendsList: [{name: "al"}]], fetched: true}
        //if failed {friendsList: [], fetched: false}
    } catch (error) {
        console.log(error)
        res.json({ friendsList: [], fetched: false })
    }
}



export const getSearchQueryUsersList = async (req: Request, res: Response) => {
    try {
        const searchQuery: string = req.query.search as string;
        if (!searchQuery || searchQuery.trim() === "") {
            return res.status(400).json({ message: "searching query cannot be empty", fetched: false })
        }
        const resultForSearch: { fetched: boolean, result: string[] } = await searchFriends(searchQuery);
        if (!resultForSearch.fetched) {
            return res.status(400).json({ fetched: false, message: "unable to fetch users" })
        }
        // fetched: true, result: searchFriendsResult.map(user => user.userName as string)
        res.status(200).json({ fetched: true, searchResult: resultForSearch.result })

        // if true {fetched: true, searchResult: [string]}
    } catch (error) {
        console.log(error)
        res.status(400).json({ fetched: false, message: "unable to fetch users" })
    }
}


export const getSuggestedFriends = async (req: Request, res: Response) => {
    try {
        const username = req.session.user?.userName;
        if (username) {
            const suggestedList = await suggestedFriendsUsingLimit(username)
            return res.json({ status: 200, suggestedList })
        }
        res.json({ status: 401, suggestedList: [] })

        // if fetched {status: 200, suggestedList: [{userName: string}]}
    } catch (error) {
        console.log(error)
        res.json({ status: 500, suggestedList: [] })
    }
}


export const checkUser = async (req: Request, res: Response) => {
    const username = req.body.username
    try {
        console.log(username, req.session)
        if (username === req.session.user?.userName) {
            return res.json({ userExists: false })
        }
        const userExists = await checkUserExisits(username);
        res.json({ userExists: userExists })
    } catch (error) {
        console.log(error)
        res.json({ userExists: false })
    }
}

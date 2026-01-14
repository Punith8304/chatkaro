import chatModel from "../models/userChatModel.js";
import userModel from "../models/userModel.js";


export type userModelFriendListType = { name: string, unread: number }
export const getUserFriendsList = async (user: string): Promise<{ success: boolean; friendsList: userModelFriendListType[] }> => {
    try {

        // const userFriendsListBeforeUpdate: { chatFriendsList: userModelFriendListType[] } | {} = (await userModel.findOne({ userName: user }, { chatFriendsList: 1 }))!
        // if ("chatFriendsList" in userFriendsListBeforeUpdate) {
        //     for (const friend of userFriendsListBeforeUpdate.chatFriendsList) {
        //         await updateUnReadCount(user, friend.name)
        //     }
        // }
        const friendsList = await userModel.findOne({ userName: user }, { chatFriendsList: 1 })
        console.log({ section: "getting user friend List", status: "success" })
        console.log(friendsList?.chatFriendsList as userModelFriendListType[])
        return {
            success: true,
            friendsList: friendsList?.chatFriendsList as userModelFriendListType[]
        }
    } catch (error) {
        console.log({ section: "getting user friend List", error })
        return {
            success: false,
            friendsList: []
        }
    }
}

export const changeChatList = async (receiver: string, sender: string): Promise<{ success: boolean; friendsList: userModelFriendListType[] }> => {
    try {
        await userModel.updateMany(
            {
                userName: {
                    $in: [receiver, sender]
                }
            },
            {
                $pull: {
                    chatFriendsList: {
                        name: {
                            $in: [sender, receiver]
                        }
                    }
                }
            }
        )
        await updateFriendsList(sender, receiver)
        await updateFriendsList(receiver, sender)
        const updatedFriendsList = await getUserFriendsList(sender)
        if (!updatedFriendsList.success) {
            console.log({ section: "changing chat list", status: "success-if-failed" })
            return {
                success: false,
                friendsList: []
            }

        }
        console.log({ section: "changing chat list", status: "success" })
        return {
            success: true,
            friendsList: updatedFriendsList?.friendsList
        }
    } catch (error) {
        console.log({ section: "changing chat list", error })
        return {
            success: false,
            friendsList: []
        }
    }
}


export const addToFriendsList = async ({ receiver, sender }: { receiver: string; sender: string }): Promise<boolean> => {
    try {
        const friendExists = await userModel.find({ userName: sender, "chatFriendsList.name": receiver })
        console.log("checking friend exists", friendExists)
        if (friendExists.length === 0) {
            await updateFriendsList(sender, receiver)
            await updateFriendsList(receiver, sender)
            console.log({ section: "adding to friends list to friend doesn't exists", status: "success" })
            return true
        }

        console.log({ section: "adding to friends list", status: "success" })
        return true
    } catch (error) {
        console.log({ section: "adding to friends list", error })
        return false
    }
}


const updateFriendsList = async (user: string, friend: string): Promise<void> => {

    try {
        const unReadCount = await getUnreadCount(user, friend)
        await userModel.updateOne({
        userName: user
    },
        {
            $push: {
                chatFriendsList: {
                    $each: [{name: friend, unread: unReadCount?.unreadCount}],
                    $position: 0
                }
            }
        }
    )
    } catch (error) {
        
    }
    
}



export const searchFriends = async (searchQuery: string): Promise<{ fetched: boolean, result: string[] }> => {
    try {
        const searchFriendsResult = await userModel.find({
            userName: { $regex: searchQuery, $options: "i" }
        },
            {
                userName: 1,
                _id: 0

            })
        console.log("getting search query friends list")
        if (!searchFriendsResult) {
            return { fetched: true, result: [] }
        }
        return { fetched: true, result: searchFriendsResult.map(user => user.userName as string) }
    } catch (error) {
        console.log(error)
        return { fetched: false, result: [] }
    }
}




export const getUnreadCount = async (user: string, userFriend: string): Promise<{status: boolean, unreadCount: number}> => {
    try {
        const unreadMessageList: { _id: [string, string]; unread: number }[] = await chatModel.aggregate([
            { $match: { "chatHistory.read": false, users: { $all: [userFriend, user] } } },
            { $group: { _id: "$users", chatHistory: { $first: "$chatHistory" } } },
            {
                $project: {
                    unread: {
                        $size: {
                            $filter: {
                                input: "$chatHistory",
                                as: "e",
                                cond: { $and: [{$eq: ["$$e.read", false]}, {$eq: ["$$e.sender", user]}] }
                            }
                        }
                    }
                }
            }
        ])
        // if (unreadMessageList[0]?.unread !== 0) {
        //     try {
        //         await userModel.updateOne({ usersName: user, "chatFriendsList.name": userFriend }, { $set: { 'chatFriendsList.$.unread': unreadMessageList[0]?.unread } })
        //         return true
        //     } catch (error) {
        //         console.log(error)
        //         return false
        //     }
        // }
        console.log("getting unread count", unreadMessageList[0]?.unread)
        return {status: true, unreadCount: unreadMessageList[0]?.unread as number}
    } catch (error) {
        console.log(error)
        return {status: false, unreadCount: 0}
    }
}

export const updateUnReadCount = async (user: string, userFriend: string): Promise<boolean> => {
    try {
        const unReadMsgsCount: {status: boolean, unreadCount: number} = await getUnreadCount(user, userFriend)
        if (unReadMsgsCount?.status) {
            try {
                await userModel.updateOne({ usersName: userFriend, "chatFriendsList.name": user }, { $set: { 'chatFriendsList.$[].unread': unReadMsgsCount?.unreadCount } })
                console.log("updating unread count", unReadMsgsCount.unreadCount)
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        }
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


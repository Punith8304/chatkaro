"use client"
import "./layout.css"
import React, { Suspense, useEffect, useState, startTransition } from "react"

import { socketObj, socket } from "@/services/socketService"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import ChatSideBar from "./ChatSideBar"
import axios from "axios"
// import ChatUI from './ChatUI';


export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const user = useSelector((state: RootState) => state.userLogin.userName)
    // const endpoint = useSelector((state: RootState) => state.api)
    // const [userFriends, setUserFriends] = useState<{ name: string }[]>([])
    // const [peers, setPeers] = useState<{ userName: string }[]>([])

    // useEffect(() => {
    //     socketObj.onUsernameSelection(user)
    //     socket.on("updated-friends", ({ updatedList, peers }) => {
    //         console.log(updatedList, peers, "event listener")
    //         setUserFriends(updatedList)
    //         setPeers(peers)
    //     })
    //     startTransition(async () => {
    //         const friendsList = await axios.get(`${endpoint}/chat/get-friends`, { withCredentials: true })
    //         const peersList = await axios.get(`${endpoint}/chat/suggested-list`, { withCredentials: true })
    //         setUserFriends(friendsList.data.friendsList)
    //         setPeers(peersList.data.suggestedList)
    //         // socket.on("get friends list", ({}))
    //     })
    // }, [])

    // establishing connection with user-connection
    useEffect(() => {
        console.log("chat layout -inside useEffect")
        socketObj.onUsernameSelection(user)
    }, [])
    return <>
        <div className="chat-layout">
            <ChatSideBar />
            {children}
        </div>
    </>
}
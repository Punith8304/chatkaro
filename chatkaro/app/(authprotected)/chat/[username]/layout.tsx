

// import { useEffect, useState } from "react"
import axios from "axios"
import UserNotFound from "@/components/UserNotFound"

export default async function ChatLayout({ children, params }: { children: React.ReactNode, params: Promise<{ username: string }> }) {
    const username = (await params).username
    const userExists = await axios.post("http://localhost:8000/api/chat/check-user", { username: username }, {withCredentials: true})
    // console.log(userExists.data)
    return <>
        {userExists.data.userExists ?
            <>{ children }</> : <UserNotFound searchTerm={username} />}
    </>
}
"use client"

import React, { startTransition, useEffect, useState } from "react"
import { messagesType } from "./page"
interface MessagesAreaProps {
    changeState: (setter: React.Dispatch<React.SetStateAction<messagesType[]>>) => void,
    loadMessages: boolean
}

export default function MessagesArea({ changeState, loadMessages }: MessagesAreaProps) {
    const [messages, setMessages] = useState<messagesType[]>([])
    useEffect(() => {
        changeState(setMessages)
    }, [loadMessages])
    return <>{
        messages.map((msg, i) => (
            <div key={i} className={`log-entry ${msg.type}`}>
                <span className="log-time">[{msg.time}]</span>
                <span className="log-sender">{msg.sender}:</span>
                <span className="log-text">{msg.text}</span>
            </div>
        ))
    }</>



}

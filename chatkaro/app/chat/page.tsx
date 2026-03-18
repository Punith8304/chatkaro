"use client"
import { useRef, useState } from "react"
import { socketObj } from "../../services/socketService"


export default function Chat() {
    const [message, setMessage] = useState()
    const inputRef = useRef<HTMLInputElement>(null)
    const userRef = useRef<HTMLInputElement>(null)

    function handleSend() {
        socketObj.onMessage(inputRef.current!.value, userRef.current!.value)
    }

    return <div>
        <input ref={inputRef} type="text" name="message"/>
        <input type="text" ref={userRef}/>
        <button onClick={handleSend}>send</button>
    </div>
}
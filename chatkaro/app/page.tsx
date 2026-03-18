"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

import axios from "axios"
import { useRef } from "react"


import { socket, socketObj } from "../services/socketService"


export default function Home() {
  const router = useRouter()
  const userNameRef = useRef<HTMLInputElement>(null)

  socket.on("private message", ({ content, from }) => {
    console.log(content, from)
  })

  socket.on("session", ({sessionID, userID}) => {
    socket.auth = {sessionID};
    localStorage.setItem("sessionID", sessionID);
    (socket as any).userID = userID
  })
  async function checkLogin() {
    console.log(userNameRef.current?.value)
    socketObj.onUsernameSelection(userNameRef.current!.value)
    router.push("/chat")
  }


  return (
    <div>
      <input type="text" ref={userNameRef} />
      <button onClick={checkLogin}>login</button>
    </div>
  );
}

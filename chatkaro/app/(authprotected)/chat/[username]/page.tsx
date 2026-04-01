"use client"
import React, { useState, use, FormEvent, useRef, startTransition, useEffect, useTransition } from "react";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { socket, socketObj } from "@/services/socketService"
import "./ChatArea.css";
import MessagesArea from "./MessageArea";
import axios from "axios";
import UserNotFound from "@/components/UserNotFound";

export type gotMsgsDataType = {
  sender: string,
  message: string,
  date: string,
  // read: boolean,
  // _id: string
}
export type messagesType = {
  sender: string,
  text: string,
  time: string,
  type: "received" | "sent"
}

export default function ChatArea({ params }: { params: Promise<{ username: string }> }) {
  const loadedCountRef = useRef(0)
  const changeFriendsList = useRef<boolean>(true)
  const [isPending, startTransition] = useTransition()
  const user = useSelector((state: RootState) => state.userLogin.userName)
  const endpoint = useSelector((state: RootState) => state.api)
  const messageRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<messagesType[]>([])
  const { username } = use(params)
  // const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);

  // messaging through socket.io (emitting message event - private)



  // emitting message event and updating in the state
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    // console.log(changeFriendsList.current, "value of ref")
    event.preventDefault()
    if (messageRef.current?.value) {
      let sendingMessage = messageRef.current.value
      startTransition(() => {
        socketObj.onMessage(sendingMessage, username);
        setMessages(prev => {
          return [...prev, { sender: user, text: sendingMessage, time: new Date().toLocaleDateString("en-GB", {timeZone: "Asia/Kolkata"}), type: "sent" }]
        })
        if (changeFriendsList.current) {
          socketObj.updateFriendsList()
          changeFriendsList.current = false
        }
      })
      messageRef.current.value = ""
    }
  }

  // listening from incoming data --messages

  useEffect(() => {
    // console.log("re-render")
    (async function () {
      await getPreviousMsgs(loadedCountRef.current);
    })();
    socket.on("send-message", ({ content, from, to, date }: { content: string, from: string, to: string, date: string }) => {
      console.log("received")
      startTransition(() => {
        if (from === username) {
          setMessages(prev => {
            return [...prev, { sender: from, text: content, time: date, type: "received" }]
          })
        } else {
          socketObj.updateFriendsList()
        }
      })
    })
  }, [])

  async function getPreviousMsgs(loadedMsgsCount: number) {
    startTransition(async () => {
      const loadMsgs = await axios.get(`${endpoint}/chat/get-chat/${username}?loadedMsgsCount=${loadedMsgsCount}`, { withCredentials: true })
      const msgs = loadMsgs.data.messages.map((message: gotMsgsDataType) => {
        return { sender: message.sender, text: message.message, time: message.date.replaceAll("/", "-"), type: message.sender === user ? "sent" : "received" }
      })
      // console.log(msgs)
      setMessages(prev => [...msgs, ...prev]);

      loadedCountRef.current += loadMsgs.data.messages.length
    })
  }
  // function changechildState(cb: React.Dispatch<React.SetStateAction<messagesType[]>>) {
  //   cb((prev: messagesType[]) => {
  //     return [...prev,]
  //   })
  // }






  const checkConnection: messagesType[] = [
    { sender: user, text: "ssh establish --node-77", time: new Date().toLocaleDateString("en-GB", {timeZone: "Asia/Kolkata"}).replaceAll("/", "-"), type: "sent" },
    { sender: username, text: "Connection accepted. Handshake 0xCC4. How can I help?", time: new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" }).replaceAll("/", "-"), type: "received" },
    { sender: user, text: "grep --source 'ProductFinder' error logs", time: new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" }).replaceAll("/", "-"), type: "sent" },
  ];

  if (user === username) {
    return <UserNotFound searchTerm={user} />
  }
  return (
    <div className="chat-interface">
      <header className="chat-header">
        <span className="term-green">●</span>
        <span className="connection-info"> CONNECTED: {username} [192.168.1.77]</span>
        <span className="latency">LATENCY: 14ms</span>
      </header>
      <div className="message-stream">
        {checkConnection.map((msg, i) => (
          <div key={i} className={`log-entry ${msg.type}`}>
            <span className="log-time">[{msg.time}]</span>
            <span className="log-sender">{msg.sender}:</span>
            <span className="log-text">{msg.text}</span>
          </div>
        ))}
        {/* --- LOAD PREVIOUS SECTION --- */}
        <div className="load-previous-container">
          {isPending ? (
            <div className="buffer-loading">
              <span className="term-blue">[WAIT]</span>
              <span className="loading-text"> fetching_history_buffer...</span>
              <div className="loading-bar-mini"></div>
            </div>
          ) : (
            <button
              className="load-prev-btn"
              onClick={async () => await getPreviousMsgs(loadedCountRef.current)}
            >
              <span className="term-gray">---</span>
              <span className="btn-text"> journalctl --load-previous </span>
              <span className="term-gray">---</span>
            </button>
          )}
        </div>

        {/* <MessagesArea changeState={changechildState} loadMessages={true} /> */}
        {
          messages.map((msg, i) => (
            <div key={i} className={`log-entry ${msg.type}`}>
              <span className="log-time">[{msg.time}]</span>
              <span className="log-sender">{msg.sender}:</span>
              <span className="log-text">{msg.text}</span>
            </div>
          ))
        }


        <div className="stream-end"></div>
      </div>

      <div className="chat-input-wrapper">
        <form className="command-line-form" onSubmit={sendMessage}>
          <span className="prompt-prefix">{`${user}`}@stdout:~$</span>
          <input
            ref={messageRef}
            type="text"
            placeholder="Type a message or command..."
            autoComplete="off"
            autoFocus
          />
          <button type="submit" className="hidden-btn">ENTER</button>
        </form>
      </div>
    </div>
  );
}
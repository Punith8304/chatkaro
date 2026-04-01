"use client"

import { useEffect } from "react";
import "./EmptyChat.css"
import { socket, socketObj } from "@/services/socketService";


export default function ChatPage() {
  useEffect(() => {
    socket.on("send-message", () => {
      socketObj.updateFriendsList()
      console.log("empty chat --not selected")
    })
  }, [])

  console.log("empty chat")
  return (
    <div className="empty-chat">
      <div className="terminal-idle-content">

        {/* Linux System Icon (ASCII-style) */}
        <div className="terminal-logo">
          <pre>
            {`  _______
 |   _   |
 |  |_|  |
 |_______|
 [ IDLE ]`}
          </pre>
        </div>

        <h2 className="terminal-status-title">WAITING_FOR_INPUT...</h2>

        <div className="system-logs">
          <p className="log-line">
            <span className="term-blue">[INFO]</span> No active process found in chat_buffer.
          </p>
          <p className="log-line">
            <span className="term-green">suggestion:</span> Select a node from the sidebar to establish a handshake.
          </p>
        </div>

        <div className="terminal-hint">
          <span className="blink">_</span> Tip: Use the search (grep) to find specific peers.
        </div>

      </div>
    </div>
  );
}
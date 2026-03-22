"use client"
import React, { useState } from "react";
// import "./ChatPage.css";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Last login: Sun Mar 22 16:41:24 on ttys001" },
    { role: "user", content: "ls -a projects" },
    { role: "bot", content: "Fetching secure data... connection established." },
  ]);

  return (
    <div className="terminal-container">
      {/* Sidebar - Refined Linux Style */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <h3>root@chat:~</h3>
        </div>
        
        <div className="search-wrapper">
          <span className="prompt-char">$</span>
          <input type="text" placeholder="grep 'friend'..." />
        </div>

        <div className="sidebar-scroll">
          <Section title="Active_Nodes">
            <UserItem name="punit_dev" active />
            <UserItem name="kernel_master" />
          </Section>
          <Section title="Nearby_Peers">
            <UserItem name="guest_404" />
          </Section>
        </div>
      </aside>

      {/* Conversation Area */}
      <main className="chat-area">
        <div className="chat-header">
          <span className="path">/home/user/conversations/punit_dev</span>
        </div>

        <div className="messages-container">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <span className="msg-prefix">
                {msg.role === "user" ? "user@ubuntu:~$" : "root@system:>"}
              </span>
              <span className="msg-content">{msg.content}</span>
            </div>
          ))}
          <div className="typing-cursor">_</div>
        </div>

        <div className="input-area">
          <span className="input-prompt">❯</span>
          <input type="text" placeholder="Type a command..." autoFocus />
        </div>
      </main>
    </div>
  );
}

// Sub-components for cleaner code
function Section({ title, children }: {title: string, children: React.ReactNode}) {
  return (
    <div className="section">
      <p className="section-title">[{title}]</p>
      {children}
    </div>
  );
}

function UserItem({ name, active }: {
  name: string, active?: Boolean
}) {
  return (
    <div className={`user-item ${active ? "active" : ""}`}>
      <span className="status-icon">{active ? "●" : "○"}</span>
      {name}.sh
    </div>
  );
}
"use client"
import "./layout.css"
import FriendsList from "./friendsList"
// import ChatUI from './ChatUI';

export default function ChatLayout({ children }: { children: React.ReactNode }) {

    return <>
        <div className="chat-layout">
            {FriendsList()}
            {children}
        </div>
    </>
}
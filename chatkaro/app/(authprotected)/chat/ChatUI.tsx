import React from 'react';
import './ChatUI.css';

interface ChatUIProps {}

const ChatUI: React.FC<ChatUIProps> = () => {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
      </div>

      <div className="messages-container">
        <div className="message received">
          <div className="message-content">
            Hello! How are you?
          </div>
          <div className="message-time">10:30 AM</div>
        </div>

        <div className="message sent">
          <div className="message-content">
            I'm doing great! Thanks for asking.
          </div>
          <div className="message-time">10:32 AM</div>
        </div>
      </div>

      <div className="input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
        />
        <button className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
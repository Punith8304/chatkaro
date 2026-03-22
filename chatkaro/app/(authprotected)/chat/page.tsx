import "./emptyChat.css";

export default async function Chat() {
  return (
    <div className="empty-chat">
      <div className="empty-chat-content">

        <div className="empty-icon">
          💬
        </div>

        <h2>Select a conversation</h2>

        <p>
          Choose a friend from the sidebar to start chatting.
          Your messages will appear here.
        </p>

        <div className="empty-hint">
          Tip: Search or pick someone from your friends list.
        </div>

      </div>
    </div>
  );
}

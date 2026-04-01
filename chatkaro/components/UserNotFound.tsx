
import "./UserNotFound.css";

export default function UserNotFound({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="terminal-error-container">
      <div className="error-box">
        <div className="error-header">
          <span className="error-dot"></span>
          <span className="error-title">system_message — bash</span>
        </div>
        
        <div className="error-body">
          <p className="command-line">
            <span className="user-prefix">user@gnome:~$</span> grep "{searchTerm}" ./active_nodes
          </p>
          <p className="error-text">
            <span className="error-label">ERROR:</span> node_not_found
          </p>
          <p className="error-desc">
            No active session found for identifier: <span className="highlight-code">'{searchTerm}'</span>
          </p>
          <div className="cursor-line">
            <span className="user-prefix">user@gnome:~$</span>
            <span className="terminal-cursor"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
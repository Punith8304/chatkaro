import "./checkingLoginStatus.css"

export default function AuthLoading() {
  return (
    <div className="auth-loading-overlay">
      <div className="boot-sequence-box">
        
        {/* Linux Boot Style Header */}
        <div className="boot-header">
          <span className="term-green">[ OK ]</span> 
          <span className="boot-text"> Initializing secure_auth.service</span>
        </div>

        <div className="boot-body">
          <div className="boot-line">
            <span className="term-gray">mount:</span> /dev/user_session on /home/chatkaro
          </div>
          
          <div className="boot-line active">
            <span className="cursor-prompt">❯</span> 
            <span className="typing-text">verifying_checksum...</span>
          </div>

          {/* Progress Bar styled as a Terminal block loader */}
          <div className="terminal-progress-container">
            <div className="progress-label">SESSION_RESTORE_PROGRESS:</div>
            <div className="terminal-progress-track">
              <div className="terminal-progress-fill"></div>
            </div>
          </div>
        </div>

        <div className="boot-footer">
          <span className="blink-dot">●</span> 
          RESTORE_WORKSPACE_DAEMON_V2.0
        </div>
      </div>
    </div>
  );
}
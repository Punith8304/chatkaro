import "./checkingLoginStatus.css"

export default function AuthLoading() {
  return (
    <div className="auth-loading-overlay">
      <div className="auth-loading-box">

        <div className="auth-logo">
          <span className="dot"></span>
          <span>System Authentication</span>
        </div>

        <div className="auth-spinner"></div>

        <div className="auth-content">
          <p className="auth-title">Signing you in</p>
          <p className="auth-sub">
            Verifying session and restoring your workspace…
          </p>
        </div>

        <div className="auth-progress">
          <div className="auth-progress-bar"></div>
        </div>

      </div>
    </div>
  );
}
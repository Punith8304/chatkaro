import React from "react";
import "./SidebarFallback.css"; // We'll put the CSS in your main layout file

export default function SidebarFallback() {
  return (
    <aside className="terminal-sidebar probe-active">
      {/* 1. Standard Terminal Header */}
      <div className="sidebar-header">
        <div className="window-controls">
          <span className="dot exit"></span>
          <span className="dot minimize"></span>
          <span className="dot maximize"></span>
        </div>
        <div className="terminal-title">systemctl — status chat_daemon</div>
      </div>

      {/* 2. Probing Output */}
      <div className="probe-content">
        <div className="probe-line active">
          <span className="probe-prompt">❯</span> 
          <span className="probe-text"> probing_active_nodes...</span>
        </div>

        {/* 3. Shimmer Lines representing "Wait" */}
        <div className="shimmer-container">
          <div className="shimmer-line"></div>
          <div className="shimmer-line dimmed"></div>
          <div className="shimmer-line dimmed"></div>
        </div>

        {/* 4. Status Footnote */}
        <div className="probe-status">
          [WAIT] Received 0 bytes / packet stream: 0x0
        </div>
      </div>

      {/* 5. Match the real Sidebar footer height */}
      <div className="sidebar-footer">
        <span>---</span>
        <span>L:SCAN</span>
      </div>
    </aside>
  );
}
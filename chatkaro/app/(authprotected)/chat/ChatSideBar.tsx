"use client"
import React, { useState } from "react";
import "./ChatSideBar.css";

export default function TerminalSidebar() {
  const [search, setSearch] = useState("");

  // Generating 25 Fake Friends
  const friends = Array.from({ length: 25 }, (_, i) => `node_serv_${i + 100}.sh`);
  // Generating 10 Nearby Peers
  const peers = Array.from({ length: 10 }, (_, i) => `peer_void_${i + 1}.py`);

  return (
    <aside className="terminal-sidebar">
      {/* OS Header Style */}
      <div className="sidebar-header">
        <div className="window-controls">
          <span className="dot exit"></span>
          <span className="dot minimize"></span>
          <span className="dot maximize"></span>
        </div>
        <div className="terminal-title">bash — 80×24</div>
      </div>

      {/* Terminal Search Input */}
      <div className="search-section">
        <span className="grep-label">grep</span>
        <input
          type="text"
          placeholder="find_user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="terminal-input"
        />
      </div>

      {/* Scrollable List Area */}
      <div className="sidebar-scrollable-content">
        
        <div className="directory-group">
          <p className="dir-label">~/active_nodes ({friends.length})</p>
          {friends.map((name, i) => (
            <div key={i} className={`user-item ${i === 0 ? "active" : ""}`}>
              <span className="chevron">❯</span>
              <span className="file-name">{name}</span>
            </div>
          ))}
        </div>

        <div className="directory-group">
          <p className="dir-label">~/nearby_peers ({peers.length})</p>
          {peers.map((name, i) => (
            <div key={i} className="user-item">
              <span className="chevron dimmed">❯</span>
              <span className="file-name">{name}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Status Bar Footnote */}
      <div className="sidebar-footer">
        <span>UTF-8</span>
        <span>L:{friends.length + peers.length}</span>
      </div>
    </aside>
  );
}
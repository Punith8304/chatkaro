"use client"

import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState, useTransition, useCallback } from "react";
import SidebarFallback from "@/components/sideBarFallback"
import "./ChatSideBar.css";
import axios from "axios"
import { socket } from "@/services/socketService"
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import debounce from "@/services/debounce";

export default function TerminalSidebar() {
  const [search, setSearch] = useState("");
  const endpoint = useSelector((state: RootState) => state.api)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  // // Generating 25 Fake Friends
  // const friends = Array.from({ length: 25 }, (_, i) => `node_serv_${i + 100}.sh`);
  // Generating 10 Nearby Peers
  const router = useRouter()
  const [userFriends, setUserFriends] = useState<{ name: string }[]>([])
  const [peers, setPeers] = useState<{ userName: string }[]>([])
  const [searchResults, setSearchResults] = useState<string[]>([])

  const searchDebouce = useCallback(debounce(async (search: string) => {
    const searchResults = await axios.get(`${endpoint}/chat/search?search=${search}`, { withCredentials: true })
    console.log(searchResults.data)
    setSearchResults(searchResults.data.searchResult)
  }, 2000), [])

  // fetching friends
  useEffect(() => {
    socket.on("updated-friends", ({ updatedList, peers }) => {
      console.log(updatedList, peers, "event listener")
      setUserFriends(updatedList)
      setPeers(peers)
    })
    startTransition(async () => {
      const friendsList = await axios.get(`${endpoint}/chat/get-friends`, { withCredentials: true })
      const peersList = await axios.get(`${endpoint}/chat/suggested-list`, { withCredentials: true })
      setUserFriends(friendsList.data.friendsList)
      setPeers(peersList.data.suggestedList)
      // socket.on("get friends list", ({}))
    })
  }, [])


  async function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    console.log("changed", event.target.value)
    const searchQuery = event.target.value
    setSearch(searchQuery)
    if (!searchQuery) {
      setSearchResults([])
    }
    searchDebouce(searchQuery)
  }
  // const searchResults = Array.from({ length: 20 }, (_, i) => ({ name: `search_result_${i + 1}.sh` }));


  // const peers = Array.from({ length: 10 }, (_, i) => `peer_void_${i + 1}.py`);

  return (
    <aside className="terminal-sidebar">
      <div className="sidebar-header">
        <div className="window-controls">
          <span className="dot exit"></span>
          <span className="dot minimize"></span>
          <span className="dot maximize"></span>
        </div>
        <div className="terminal-title">bash — 80×24</div>
      </div>

      <div className="search-section">
        <span className="grep-label">grep</span>
        <input
          type="text"
          placeholder="find_user..."
          value={search}
          onChange={handleSearch}
          className="terminal-input"
          autoFocus
        />

        {/* The Clear Button */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="search-clear-btn"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="sidebar-scrollable-content">

        {/* ===== SEARCH RESULTS SECTION (STAY ON TOP) ===== */}
        {search && (
          <div className="directory-group search-results-group">
            <p className="dir-label">~/query_hits ({searchResults.length})</p>
            <div className="search-results-limit">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  className="user-item search-match"
                  onClick={() => { router.replace(`/chat/${res}`) }}
                >
                  <span className="chevron highlight">❯</span>
                  <span className="file-name">{res}</span>
                </div>
              ))}
            </div>
            <div className="search-divider"></div>
          </div>
        )}

        {/* ===== YOUR ORIGINAL ACTIVE NODES ===== */}
        <div className="directory-group">
          <p className="dir-label">~/active_nodes ({userFriends.length})</p>
          {isPending ? <SidebarFallback /> : (
            userFriends.map((friend, i) => (
              <div
                key={i}
                className={`user-item ${pathname === `/chat/${friend.name}` ? "active" : ""}`}
                onClick={() => { router.replace(`/chat/${friend.name}`) }}
              >
                <span className="chevron">❯</span>
                <span className="file-name">{friend.name}</span>
              </div>
            ))
          )}
        </div>

        {/* ===== YOUR ORIGINAL PEERS ===== */}
        <div className="directory-group">
          <p className="dir-label">~/nearby_peers ({peers.length})</p>
          {peers.map((user, i) => (
            <div
              key={i}
              className={`user-item ${pathname === `/chat/${user.userName}` ? "active" : ""}`}
              onClick={() => { router.replace(`/chat/${user.userName}`) }}
            >
              <span className="chevron dimmed">❯</span>
              <span className="file-name">{user.userName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <span>UTF-8</span>
        <span>L:{userFriends.length + peers.length}</span>
      </div>
    </aside>
  )
}
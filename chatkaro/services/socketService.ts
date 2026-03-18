import { io } from "socket.io-client"

const server = "http://localhost:8000"

export const socket = io(server, { autoConnect: false })
export const socketObj = {
  usernameAlreadySelected: false,
  onUsernameSelection(username: string) {
    this.usernameAlreadySelected = true;
    socket.auth = { username };
    socket.connect();
  },
  onMessage(message: string, to: string) {
    console.log(socket)
    socket.emit("private message", {
      content: message,
      to: to
    })
  },
  created() {
    const sessionID = localStorage.getItem("sessionID")
    if (sessionID) {
      this.usernameAlreadySelected = true
      socket.auth = { sessionID }
      socket.connect();
    }
  }
}
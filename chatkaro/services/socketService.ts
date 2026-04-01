import { io } from "socket.io-client"

const server = "http://localhost:8000"

export const socket = io(server, { autoConnect: false })
export const socketObj = {
  onUsernameSelection(username: string) {
    socket.auth = { user: username};
    console.log(socket)
    socket.connect();
  },
  onMessage(message: string, to: string) {
    socket.emit("private-message", {
      content: message,
      to: to
    })
  },
  updateFriendsList() {
    socket.emit("update-friends")
  }
}
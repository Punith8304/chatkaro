//run npm run build
//run npm start

import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io"


import authentication from "./routes/authentication.js"
import connectDB from "./config/connectMongoDB.js"
import chat from "./routes/chat.js"
import { store } from "./config/sessionStore.js";


import connectionCB, { checkConnection } from "./services/liveMessageService.js";


const app = express()

dotenv.config()

app.use(express.json())

// cors config
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}))

await connectDB()



store.on('error', function (error) {
    console.log(error)
})


const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        // transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
})




// socket io 
io.use(checkConnection);
io.on("connection", connectionCB)



app.set("trust proxy", 1)
app.use(session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    store: store,
    rolling: true,
    cookie: {
        maxAge: 60 * 1000 * 60 * 24 * 10,
        httpOnly: true,
        secure: false
    }
}))


declare module "express-session" {
    interface SessionData {
        user: {
            userName: string;
            login: boolean;
        }
    }
}


app.use("/api/authentication", authentication)
app.use("/api/chat", chat)

app.get("/check", (req, res) => {
    res.send("Hi Punith")
})

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running successfully on port ${process.env.SERVER_PORT}`)
})


export { app }
//run npm run build
//run npm start

import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session";


import authentication from "./routes/authentication.js"
import connectDB from "./config/connectMongoDB.js"
import chat from "./routes/chat.js"
import { Store } from "express-session";
import { store } from "./config/sessionStore.js";

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

await connectDB()


store.on('error', function (error) {
    console.log(error)
})

app.set("trust proxy", 1)
app.use(session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 60 * 1000,
        httpOnly: true,
        secure: false
    }
}))


declare module "express-session" {
    interface SessionData {
        user: {
            userName: string;
            login: boolean
        }
    }
}


app.use("/api/authentication", authentication)
app.use("/api/chat", chat)


app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running successfully on port ${process.env.SERVER_PORT}`)
})



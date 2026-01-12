import mongoDBSessionStore from "connect-mongodb-session"
import session from "express-session"


const MongoDBStore = mongoDBSessionStore(session)

export const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017/chatkaro-session-store",
    collection: "mysessions"
})
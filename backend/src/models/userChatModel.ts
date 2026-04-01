import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    users: [String],
    chatHistory: {
        type: [{
            sender: String,
            message: String,
            date: String,
            read: {
                type: Boolean,
                default: false
            }
        }],
        default: []
    }
})

const chatModel = mongoose.model("chat", chatSchema)


export default chatModel



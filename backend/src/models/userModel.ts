import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userEmail: String,
    userPassword: String,
    userName: String,
    socketID: { type: String, default: "" },
    chatFriendsList: {
        type: [{
            name: String, unread: {
                type: Number,
                default: 0
            }
        }],
        default: []
    }
})


const userModel = mongoose.model('user', userSchema)


export default userModel;


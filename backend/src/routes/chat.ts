import { Router } from "express";
import { sendMessageToUser, getChatHistory, getFriendsList, getSearchQueryUsersList, getSuggestedFriends } from "../controllers/userChatController.js"
import { checkUser } from "../controllers/userChatController.js";



const router = Router()

router.get("/get-friends", getFriendsList) //{user}
router.get("/search", getSearchQueryUsersList) //query {search}
router.post("/send-message/:userName", sendMessageToUser) //params, {receiver}, {sender, message}
router.get("/get-chat/:userName", getChatHistory) //params {userName}, query {loadedMsgsCount}
router.get("/suggested-list", getSuggestedFriends) //{user}
router.post("/check-user", checkUser)

export default router
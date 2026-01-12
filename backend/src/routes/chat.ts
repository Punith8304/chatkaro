import { Router } from "express";
import { sendMessageToUser, getChatHistory, getFriendsList, getSearchQueryUsersList } from "../controllers/userChatController.js"
import {  } from "../controllers/userChatController.js";


const router = Router()

router.get("/get-friends", getFriendsList) //{user}
router.get("/search", getSearchQueryUsersList) //query {search}
router.post("/:userName", sendMessageToUser) //params, {receiver}, {sender, message}
router.get("/:userName", getChatHistory) //params {userName}



export default router
const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const messageController = require("../Controller/messageController"); 
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
router.post("/", authorizationMiddleware(["user"]), messageController.createMessage);
router.post("/", authorizationMiddleware(["user"]), messageController.updateMessage);
router.get('/message/:id', autherizationMiddleware(["user"]),Messagescontroller.getMessageById);//admin
router.get('/', autherizationMiddleware(["user"]), Messagescontroller.getAllMessages);//admin
router.delete('/:id', autherizationMiddleware(["user"]), Messagescontroller.deleteMessageById);
router.post('/sendMessage', autherizationMiddleware(["user"]), Messagescontroller.sendMessage);
module.exports = router; // ! Don't forget to export the router

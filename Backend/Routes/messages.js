const express = require('express');
const router = express.Router();
const messageController = require('../Controller/messagesController');
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

// Define routes for messageController
router.post('/', authorizationMiddleware(['user']), messageController.createMessage);
router.get('/getAll', messageController.getAllMessages);
router.get('/:id', messageController.getMessageById);
router.delete('/:id', messageController.deleteMessageById);
router.get('/getAllChats', messageController.getChat); // Update route to use getChat method
router.put('/update/:id', messageController.updateMessage);
router.post('/createPrivateChat', messageController.createPrivateChat);
router.post('/check', messageController.checkChat);
router.get('/chats', messageController.getChat);
router.post('/save', authorizationMiddleware(['user', 'agent', 'manager', 'admin']), messageController.saveMessage);
router.post('/userChat', authorizationMiddleware(['user']), messageController.chatUser);
module.exports = router;
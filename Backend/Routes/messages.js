const express = require('express');
const router = express.Router();
const messageController = require('../Controller/messagesController');

// Define routes for messageController
router.post('/', messageController.createMessage);
router.get('/getAllChats', messageController.getChat); // Update route to use getChat method
router.put('/update/:id', messageController.updateMessage);
router.post('/createPrivateChat', messageController.createPrivateChat);
router.post('/check', messageController.checkChat);
router.get('/chats', messageController.getChat); 
module.exports = router;
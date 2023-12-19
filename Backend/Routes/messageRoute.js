const express = require('express');
const router = express.Router();
const messageController = require('../Controller/MessagesController');

// Define routes for messageController
router.post('/', messageController.createMessage);
router.get('/getAllChats', messageController.getAllChats);
router.put('/update/:id', messageController.updateMessage);
router.post('/createPrivateChat', messageController.createPrivateChat);
router.post('/check', messageController.checkChat);
module.exports = router;

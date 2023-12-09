// Import necessary modules
const express = require('express');
const router = express.Router();
const messagesController = require('../Controller/MessagesController');

// Routes for MessagesModel CRUD operations
router.post('/messages', messagesController.createMessage);
router.get('/messages/:id', messagesController.getMessageById);
router.get('/messages', messagesController.getAllMessages);
router.put('/messages/:id', messagesController.updateMessage);
router.delete('/messages/:id', messagesController.deleteMessage);
router.post('/messages/add', messagesController.addMessageToArray);


module.exports = router;

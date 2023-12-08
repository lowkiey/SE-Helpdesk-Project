const express = require('express');
const router = express.Router();
const messageController = require('../Controller/MessagesController');

// Define routes for messageController
router.post('/', messageController.createMessage);
router.put('/update/:id', messageController.updateMessage);

module.exports = router;

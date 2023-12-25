const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); 
const notificationController = require("../Controller/notificationController.js");
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.get("/", authorizationMiddleware(['user', 'agent','manager','admin']), notificationController.getNotifications);


module.exports = router; // ! Don't forget to export the router

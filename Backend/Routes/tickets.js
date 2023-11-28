const express = require("express");
const router = express.Router();
const ticketsController = require("../Controller/ticketsController");
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
module.exports = router; // ! Don't forget to export the router

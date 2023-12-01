const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
module.exports = router; // ! Don't forget to export the router

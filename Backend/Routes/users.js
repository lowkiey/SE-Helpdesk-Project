const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
router.get("/updateRole", authorizationMiddleware(['admin']), userController.updateRole);

module.exports = router; // ! Don't forget to export the router

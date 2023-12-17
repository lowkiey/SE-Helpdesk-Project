const express = require("express");
const router = express.Router();

const userController = require("../Controller/userController");
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

// * login
router.post("/login", userController.login);
router.post("/login/verify", userController.verify);

// * register
router.post("/register", userController.register);

module.exports = router; // ! Don't forget to export the route
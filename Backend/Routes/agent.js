const express = require("express");
const router = express.Router();
const AgentController = require("../Controller/AgentController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');


module.exports = router; // ! Don't forget to export the router

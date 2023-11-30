const express = require("express");
const router = express.Router();
const FAQController = require("../Controller/FAQController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/", authorizationMiddleware(['user']), FAQController.createFAQ);

module.exports = router; // ! Don't forget to export the router

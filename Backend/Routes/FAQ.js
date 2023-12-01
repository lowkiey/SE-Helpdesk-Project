// FAQ.js
const express = require("express");
const router = express.Router();
const FAQController = require("../Controller/FAQController");
const userController = require("../Controller/userController");
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');

router.post("/", authorizationMiddleware(['user']), FAQController.createFAQ);
router.get("/", authorizationMiddleware(['user']), FAQController.searchFAQ);

module.exports = router;

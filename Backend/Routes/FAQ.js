// FAQ.js
const express = require("express");
const router = express.Router();
const FAQController = require("../Controller/FAQController");
const userController = require("../Controller/userController");
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/", authorizationMiddleware(['user', 'agent', 'maager', 'admin']), FAQController.createFAQ);
router.get("/search", authorizationMiddleware(['user', 'agent', 'maager', 'admin']), FAQController.searchFAQ);
router.get('/', authorizationMiddleware(['user', 'agent', 'maager', 'admin']), FAQController.searchFAQBySubcategory);


module.exports = router;
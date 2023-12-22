// FAQ.js
const express = require("express");
const router = express.Router();
const FAQController = require("../Controller/FAQController");
const userController = require("../Controller/userController");
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/", authorizationMiddleware(['user']), FAQController.createFAQ);
router.get("/search", authorizationMiddleware(['user']), FAQController.searchFAQ);
router.get('/', authorizationMiddleware(['user']), FAQController.searchFAQBySubcategory);


module.exports = router;
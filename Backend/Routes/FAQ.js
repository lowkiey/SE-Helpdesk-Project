const express = require("express");
const router = express.Router();
const FAQController = require("../Controller/FAQController");
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/createFAQ", authorizationMiddleware(['user']), FAQController.createFAQ);
router.get("/searchFAQ", authorizationMiddleware(['user']), FAQController.searchFAQ);

module.exports = router;

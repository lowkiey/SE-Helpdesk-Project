const express = require("express");
const router = express.Router();
const reportController = require("../Controller/reportController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.get("/", authorizationMiddleware(['manager']), reportController.viewIssues);

module.exports = router; // ! Don't forget to export the router

const express = require("express");
const router = express.Router();
const reportController = require("../Controller/reportController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.get("/:id", authorizationMiddleware(['manager', "user"]), reportController.viewReport);

module.exports = router; // ! Don't forget to export the router

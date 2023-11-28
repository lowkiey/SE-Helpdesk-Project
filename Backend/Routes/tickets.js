const express = require("express");
const router = express.Router();
const ticketsController = require("../Controller/ticketsController");
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/", authorizationMiddleware(['admin']), ticketsController.createTicket);
router.put("/:id", authorizationMiddleware(['agent']), ticketsController.updateTicket);
router.delete("/:id", authorizationMiddleware(['agent']), ticketsController.deleteticket);

module.exports = router; // ! Don't forget to export the router

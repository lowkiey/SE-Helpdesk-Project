const express = require("express");
const router = express.Router();
const ticketsController = require("../Controller/ticketsController");
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/", authorizationMiddleware(['user']), ticketsController.createTicket);
// router.get("/getTickets",authorizationMiddleware(['user']), ticketsController.getTickets);
router.put("/:id", authorizationMiddleware(['agent','user']), ticketsController.updateTicket);
router.put("/category/:id", authorizationMiddleware(['user']), ticketsController.categoryTicket);
router.put("/", authorizationMiddleware(['user']), ticketsController.subCategory);
// router.put("/priorr/:id", authorizationMiddleware(['user']), ticketsController.priorityy);
router.get("/", authorizationMiddleware(['user', 'manager', 'agent']), ticketsController.getAllTickets);

module.exports = router; // ! Don't forget to export the router
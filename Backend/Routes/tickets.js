const express = require("express");
const router = express.Router();
const ticketsController = require("../Controller/ticketsController");
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/", authorizationMiddleware(['user']), ticketsController.createTicket);
router.put("/:id", authorizationMiddleware(['agent']), ticketsController.updateTicket);
router.delete("/:id", authorizationMiddleware(['agent']), ticketsController.deleteticket);
router.put("/category/:id", authorizationMiddleware(['user']), ticketsController.categoryTicket);
router.put("/", authorizationMiddleware(['user']), ticketsController.subCategoryPriority);
router.put("/wfTicket/:id", authorizationMiddleware(['user']), ticketsController.workflowIssue);
router.get("/", authorizationMiddleware(['user']), ticketsController.getAllTickets);

module.exports = router; // ! Don't forget to export the router

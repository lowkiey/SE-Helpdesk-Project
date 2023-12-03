const express = require("express");
const router = express.Router();
const ticketsController = require("../Controller/ticketsController");
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.post("/", authorizationMiddleware(['user']), ticketsController.createTicket);
router.put("/:id", authorizationMiddleware(['agent']), ticketsController.updateTicket);
router.put("/category/:id", authorizationMiddleware(['user']), ticketsController.categoryTicket);
router.put("/", authorizationMiddleware(['user']), ticketsController.subCategory);
router.put("/priorr/:id", authorizationMiddleware(['user']), ticketsController.priorityy);
router.put("/wfTicket/:id", authorizationMiddleware(['user']), ticketsController.workflowIssue);

module.exports = router; // ! Don't forget to export the router

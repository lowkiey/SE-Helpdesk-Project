const express = require("express");
const router = express.Router();
const AgentController = require("../Controller/AgentController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.get("/", authorizationMiddleware(['admin'],["agent"]), AgentController.getAllAgents);
router.get("/:id", authorizationMiddleware(['admin'],["agent"]), AgentController.getAgent);
router.put("/:id", authorizationMiddleware(['admin'],["agent"]), AgentController.updateAgent);
router.delete("/:id", authorizationMiddleware(['admin'],["agent"]), AgentController.deleteAgent);


module.exports = router; // ! Don't forget to export the router
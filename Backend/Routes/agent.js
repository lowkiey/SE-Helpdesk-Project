const express = require("express");
const router = express.Router();
const AgentController = require("../Controller/AgentController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.get("/", authorizationMiddleware(['user']), AgentController.getAllAgents);
router.get("/:id", authorizationMiddleware(['user']), AgentController.getAgent);
router.put("/:id", authorizationMiddleware(['user']), AgentController.updateAgent);
router.delete("/:id", authorizationMiddleware(['user']), AgentController.deleteAgent);


module.exports = router; // ! Don't forget to export the router

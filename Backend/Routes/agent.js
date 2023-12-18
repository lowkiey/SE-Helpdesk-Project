const express = require("express");
const router = express.Router();
const AgentController = require("../Controller/AgentController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.get("/getAll", authorizationMiddleware(['admin','user','agent']), AgentController.getAllAgents);
router.get("/:id", authorizationMiddleware(['admin','user','agent']), AgentController.getAgent);
router.put("/:id", authorizationMiddleware(['admin','user','agent']), AgentController.updateAgent);
router.delete("/:id", authorizationMiddleware(['admin','user','agent']), AgentController.deleteAgent);


module.exports = router; // ! Don't forget to export the router
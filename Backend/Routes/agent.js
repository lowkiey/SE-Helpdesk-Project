const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const AgentController = require("../Controller/AgentController"); // Fix casing issue
=======
const AgentController = require("../Controller/agentController"); // Fix casing issue
>>>>>>> Farida
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');

router.get("/", authorizationMiddleware(['admin']), AgentController.getAllAgents);
router.get("/:id", authorizationMiddleware(['admin']), AgentController.getAgent);
router.put("/:id", authorizationMiddleware(['admin']), AgentController.updateAgent);
router.delete("/:id", authorizationMiddleware(['admin']), AgentController.deleteAgent);


<<<<<<< HEAD
module.exports = router; // ! Don't forget to export the router
=======
module.exports = router; // ! Don't forget to export the router
>>>>>>> Farida

const express = require('express');
const agentController = require('../controllers/AgentController');

const router = express.Router();

// Create a new agent
router.post('/agents', agentController.createAgent);

// Get all agents
router.get('/agents', agentController.getAllAgents);

// Get a specific agent by ID
router.get('/agents/:id', agentController.getAgent);

// Update a specific agent by ID
router.put('/agents/:id', agentController.updateAgent);

// Delete a specific agent by ID
router.delete('/agents/:id', agentController.deleteAgent);

module.exports = router;

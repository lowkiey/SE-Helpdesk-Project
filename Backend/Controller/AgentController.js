const AgentModel = require("../Models/Agent");
const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const logError = require('../utils/logger');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const AgentController = {
    getAllAgents: async (req, res) => {
        try {
            const agents = await AgentModel.find().lean();
            console.log("hi")
            
            return res.status(200).json({ agents });
        } catch (error) {
            console.error("Error fetching agents:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    getAgent: async (req, res) => {
        try {
            const { id } = req.params;
            const agent = await AgentModel.findById(id).lean();
            return res.status(200).json({ agent });
        } catch (error) {
            console.error("Error fetching agent:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    updateAgent: async (req, res) => {
        try {
            const { id } = req.params;
            const { rating, resolution_time, ticket_id, agentAvailability } = req.body;

            const updatedAgent = await AgentModel.findByIdAndUpdate(
                id,
                {
                    rating,
                    resolution_time,
                    ticket_id,
                    agentAvailability,
                },
                { new: true }
            ).lean();

            return res.status(200).json({ updatedAgent });
        } catch (error) {
            console.error("Error updating agent:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    deleteAgent: async (req, res) => {
        try {
            const { id } = req.params;
            await AgentModel.findByIdAndDelete(id);
            return res.status(200).json({ message: "Agent deleted successfully" });
        } catch (error) {
            console.error("Error deleting agent:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },

};

module.exports = AgentController;

const AgentModel = require("../Models/Agent");
const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");

const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const AgentController = {
    createAgent: async (req, res) => {
        try {
            const user = await userModel.findOne({ role: "agent" }, '_id').lean(); // Fetches the user with role 'agent' and selects only the _id field

            if (user && user._id) {
                const userIdString = user._id.toString(); // Convert the _id to a string

                const existingAgent = await AgentModel.findOne({ user_id: userIdString });

                if (existingAgent) {
                    console.log("Agent already exists for this user");
                    return res.status(400).json({ message: "Agent already exists for this user" });
                }

                const { rating, resolution_time, ticket_id, agentAvailability } = req.body;

                const newAgent = new AgentModel({
                    user_id: userIdString, // Assigning the user_id fetched from userModel
                    rating,
                    resolution_time,
                    ticket_id,
                    agentAvailability,
                });

                await newAgent.save();
                return res.status(201).json({ message: "Agent created successfully" });
            } else {
                console.log("No user found with role 'agent' or user ID is undefined");
                return res.status(404).json({ message: "No user found with role 'agent'" });
            }
        } catch (error) {
            console.error("Error creating agent:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    getAllAgents: async (req, res) => {
        try {
            const agents = await AgentModel.find().lean();
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
